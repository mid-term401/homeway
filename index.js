"use strict";

// 3rd Party Resources
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const superagent = require("superagent");
const pg = require("pg");
const path = require("path");

// Esoteric Resources
// const v1Routes = require('../api-server/src/routes/v1');
const errorHandler = require("./src/error-handlers/500.js");
const notFound = require("./src/error-handlers/404.js");

// Prepare the express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


const PORT = process.env.PORT || 9000;


const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// App Level MW
app.use(cors());

// Routes
app.get("/", handleHome );

app.get("/sign_up", handleSignUpForm );

app.post("/sign_up", handleSignup)

app.get("/sign_in", handleSignIn );

// functions

function handleHome(req, res) {
  res.render("index.html");
}

function handleSignUpForm(req, res) {
  res.render("signup.html");
}

function handleSignup(req, res) {
  const formData = req.body;

  let insertQuery = "insert into <name of the table>(user_name, first_name, last_name, password, email, country, birth_date, address) values ($1, $2, $3, $4, $5, $6, $7, $8)"
  const safeValues = [formData.username, formData.password, formData.first_name, formData.last_name, formData.password, formData.email, formData.country, formData.address];

  client.query(insertQuery, safeValues)
      .then(data => {
        console.log(`Data added to the database`);
        res.redirect("/");
      })
      .catch(error => {
      console.log('', error)
      })
}

function handleSignIn() {

}

// Catchalls
app.use(notFound);
app.use(errorHandler);

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER IS HERE  ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error while connecting to the DB ..", error);
  });
