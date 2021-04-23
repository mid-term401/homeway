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

app.get("/", handleHome );

app.get("/volunteers/sign_up", handleSignUpForm );

app.post("/volunteers/sign_up", handleSignup)

app.get("/sign_in", handleSignInForm );

// app.post("/sign_in", handleSignIn );

// functions

function handleHome(req, res) {
  res.render("index");
}

function handleSignUpForm(req, res) {
  res.render("signup");
}

function handleSignup(req, res) {
  try{
    const formData = req.body;

    let insertQuery = "insert into <name of the table>(user_name, first_name, last_name, password, email, country, birth_date, address) values ($1, $2, $3, $4, $5, $6, $7, $8)"
    const safeValues = [formData.username, formData.password, formData.first_name, formData.last_name, formData.password, formData.email, formData.country, formData.address];
  
    client.query(insertQuery, safeValues)
        .then(data => {
          console.log(`Data added to the database`);
          res.render("/", {user : "samer"});
        })
        .catch(error => {
        console.log('', error)
        })
  } catch (e) {
    res.send(e.message);
  }
  
}

function handleSignInForm(req, res) {
  res.render("signin");
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
