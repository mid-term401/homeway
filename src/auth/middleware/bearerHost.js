'use strict';

const client = require("../../../DataBase/data");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization) {

      const token = req.headers.authorization.split(' ').pop();
      // console.log("token", token)
      const validUser = await checkToken(token);

      // console.log("validUser", validUser);

      if (!validUser) {
        res.json("Error Incorrect username or password");
      } else {
        req.user = validUser;
        req.token = validUser.token;
      }
      // console.log("***************beaerHost", req.user, req.token);
      next();
    }
  } catch (e) {
    res.json("Invalid Login");
  }
}

async function checkToken(token) {
  try {
    const searchHost = "select * from host where token = $1 ;";

    let hostData = await client.query(searchHost, [token])
    // console.log(hostData)
    return hostData.rows[0];
  } catch (e) {
    console.log(e.message);
  }
}
