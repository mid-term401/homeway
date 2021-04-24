"use strict";

// 3rd Party Resources
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const superagent = require("superagent");
const pg = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Esoteric Resources
const errorHandler = require("./error-handlers/500");
const notFound = require("./error-handlers/404.js");

// Prepare the express app
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '../public'));
app.set('views', __dirname + '/../public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// Database

const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });


// JWT configuration

const secretKey = process.env.SECRET_KEY;
const secretKeyRefresher = process.env.SECRET_KEY_REFRESHER;


// App Level MW
app.use(cors());

// Routes

app.get("/", handleHome);

app.get("/volunteers/sign_up", handleVolunteerForm);

app.post("/volunteers/sign_up", handleVolunteerSignup);

app.get("/hosts/sign_up", handleHostForm);

app.post("/hosts/sign_up", handleHostSignup);

app.get("/sign_in", handleSignInForm);

app.post("/sign_in", handleSignIn);

// functions

function handleHome(req, res) {
  res.render("index");

  // const token = req.cookies.JWT_TOKEN;
  // if(token) {
  //   const user = await validateToken(token, JWT_SECRET);
  // }
}

function handleVolunteerForm(req, res) {
  res.render("signup_volunteer");
}

function handleHostForm(req, res) {
  res.render("signup_host");
}

function handleSignInForm(req, res) {
  res.render("signin");
}

async function handleSignIn(req, res) {
  try {
    let searchResults = 0;

    const formData = req.body;
    searchResults = await checkVolunteerExists(formData.username);
    console.log(searchResults);

    if (searchResults.length === 0) {
      searchResults = await checkHostExists(formData.username)
      console.log("Host");
    }
    if (searchResults.length === 0) {
      res.send("<h2>Error, Incorrect username or password</h2>");
    } else {
      const hashedPassword = searchResults[0].password;
      const success = await bcrypt.compare(formData.password, hashedPassword);
      
      if (success === true) {
        // Check if the user volunteer or host
        if (!searchResults[0].category) {
          const payload = { "name": searchResults[0].user_name, "role": "volunteer" }
          const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "15s" });
          const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESHER)
          // console.log("payload", payload , `Token`, token, "refreshToken", refreshToken);
          // Store the refresh token in DB
          const updateQuery = "update volunteer set token = $1 where user_name = $2;";
          const safeValues = [refreshToken, searchResults[0].user_name]
          console.log(`Refresh token`, refreshToken);
          client.query(updateQuery, safeValues)
            .then(data => {
              console.log(`Updated the token`);
              res.render("index_volunteer", {volunteerName: searchResults[0].user_name})
              // res.send(`<h2>Logged in successfully as the volunteer ${searchResults[0].user_name} </h2>`)
            })
            .catch(error => {
              console.log('Error while updating the refresh token', error)
            })
          res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly; samesite=lax`])
          // res.send({ "success": "Logged in successfully!", "refreshToken": refreshtoken })
        } else if (searchResults[0].category) {
          const payload = { "name": searchResults[0].user_name, "role": "host" }
          const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "15s" });
          const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESHER)
          // console.log("payload", payload , `Token`, token, "refreshToken", refreshToken);
          // Store the refresh token in DB
          const updateQuery = "update host set token = $1 where user_name = $2;";
          const safeValues = [refreshToken, searchResults[0].user_name]
          console.log(`Refresh token`, refreshToken);
          client.query(updateQuery, safeValues)
            .then(data => {
              console.log(`Updated the token`);
              res.render("index_host", {hostName: searchResults[0].user_name});
              // res.send(`<h2>Logged in successfully as the host ${searchResults[0].user_name} </h2>`)
            })
            .catch(error => {
              console.log('Error while updating the refresh token', error)
            })
          res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly; samesite=lax`])
          // res.send({ "success": "Logged in successfully!", "refreshToken": refreshtoken })
        } else {
          res.send("<h2>Error, Incorrect username or password</h2>");
        }
      } else {
        res.send("<h2>Error, Incorrect username or password</h2>");
      }
    }

  } catch (e) {
    console.log("Error from catch from sign in", e.message);
  }
}

async function handleVolunteerSignup(req, res) {
  try {
    // Checking if the volunteer exists in the DB
    let results = 0;
    console.log(req.body);
    const userName = req.body.username;

    results = await checkVolunteerExists(userName);

    if (results.length === 0) {
      results = await checkHostExists(userName)
    }

    console.log("results", results);

    if (results.length === 0) {
      const formData = req.body;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      let insertQuery = "insert into volunteer(user_name, first_name, last_name, password, email, country, birth_date, address) values ($1, $2, $3, $4, $5, $6, $7, $8)"
      const safeValues = [formData.username, formData.first_name, formData.last_name, hashedPassword, formData.email, formData.country, formData.birth_date, formData.address];

      client.query(insertQuery, safeValues)
        .then(data => {
          // console.log(`Volunteer added to the database`);
          res.send({"success": "Volunteer created successfully"});
        })
        .catch(error => {
          // console.log('Error while creating the a volunteer', error)
          res.send({"Error": "Volunteer was not created successfully"});
        })
    } else {
      res.send({"Error": "Volunteer already exists"});
      // res.send("<h2>Error, User already exists</h2>");
    }


  } catch (e) {
    res.send(e.message);
  }
}

async function handleHostSignup(req, res) {
  try {
    // Checking if the host exists in the DB
    let results;
    const userName = req.body.username;

    results = await checkHostExists(userName)

    if (results.length === 0) {
      results = await checkVolunteerExists(userName)
    }

    console.log("results", results);

    if (results.length === 0) {
      const formData = req.body;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      let insertQuery = "insert into host(user_name, first_name, last_name, password, email, country, birth_date, address, category) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)"
      const safeValues = [formData.username, formData.first_name, formData.last_name, hashedPassword, formData.email, formData.country, formData.birth_date, formData.address, formData.category];

      client.query(insertQuery, safeValues)
        .then(data => {
          console.log(`Host added to the database`);
          res.redirect("/");
          res.send({"success": "Host created successfully"});
        })
        .catch(error => {
          res.send({"Error": "Host was not created successfully"});
          // console.log('Error while creating the a host', error)
        })
    } else {
      // res.send("<h2>Error, Host already exists</h2>");
      res.send({"Error": "Host already exists"});
    }


  } catch (e) {
    res.send(e.message);
  }
}


function checkVolunteerExists(userName) {
  try {
    const searchQuery = "select * from volunteer where user_name = $1 ;";

    return client.query(searchQuery, [userName])
      .then(data => {
        return data.rows;
      })
      .catch(error => {
        console.log('Error while checking if the volunteer in the DB', error)
      })
  } catch (e) {
    console.log(e.message);
  }
}

function checkHostExists(userName) {
  try {
    const searchQuery = "select * from host where user_name = $1;";

    return client.query(searchQuery, [userName])
      .then(data => {
        return data.rows;
      })
      .catch(error => {
        console.log('Error while checking if the host in the DB', error)
      })
  } catch (e) {
    console.log(e.message);
  }
}




// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  start: (PORT) => {
    client
      .connect()
      .then(() => {
        // console.log("Whattttttttttttttt ..", error);
        app.listen(PORT, () => {
          console.log(`SERVER IS HERE  ${PORT}`);
        });
      })
      .catch((error) => {
        console.log("Error while connecting to the DB ..", error);
      });
  },
};
