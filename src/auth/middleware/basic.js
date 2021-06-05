'use strict';

const base64 = require('base-64');
const client = require("../../../DataBase/data");
const bcrypt = require("bcrypt");
require("dotenv").config();




module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let basic = req.headers.authorization.split(' ').pop();
      let [user, pass] = base64.decode(basic).split(':');

      req.user = await checkVolunteerExists(user);


      if (req.user.length === 0) {
        req.user = await checkHostExists(user);
      }

      if (req.user.length === 0) {
        res.send({message: "Invalid Login"});
      } else {
        const hashedPassword = req.user[0].password;
        const success = await bcrypt.compare(pass, hashedPassword);
        req.user = {
          success: success, userData: req.user[0]
        }
        next();
      }
    }
  } catch (e) {
    res.json("Invalid Login");
  }
}


async function checkVolunteerExists(userName) {
  try {
    const searchQuery = "select * from volunteer where user_name = $1 ;";
    let data = await client
      .query(searchQuery, [userName])
    return data.rows;
  } catch (e) {
    res.send({e: e});
  }
}

async function checkHostExists(userName) {
  try {
    const searchQuery = "select * from host where user_name = $1;";

    let data = await client
      .query(searchQuery, [userName])
    return data.rows;

  } catch (e) {
    res.send({e: e});
  }
}