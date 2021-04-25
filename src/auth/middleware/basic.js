'use strict';

const base64 = require('base-64');

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
        res.json("Error Incorrect username or password");
      } else {
        const hashedPassword = req.user[0].password;
        const success = await bcrypt.compare(pass, hashedPassword);

        next();
      } 
    }
  } catch (e) {
    res.status(403).send("Invalid Login");
  }
}


function checkVolunteerExists(userName) {
  try {
    const searchQuery = "select * from volunteer where user_name = $1 ;";

    return client
      .query(searchQuery, [userName])
      .then((data) => {
        return data.rows;
      })
      .catch((error) => {
        console.log("Error while checking if the volunteer in the DB", error);
      });
  } catch (e) {
    console.log(e.message);
  }
}

function checkHostExists(userName) {
  try {
    const searchQuery = "select * from host where user_name = $1;";

    return client
      .query(searchQuery, [userName])
      .then((data) => {
        return data.rows;
      })
      .catch((error) => {
        console.log("Error while checking if the host in the DB", error);
      });
  } catch (e) {
    console.log(e.message);
  }
}