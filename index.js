"use strict";

// 3rd Party Resources
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const superagent = require("superagent");
const pg = require("pg");

// Esoteric Resources
// const v1Routes = require('../api-server/src/routes/v1');
const errorHandler = require("./src/error-handlers/500.js");
const notFound = require("./src/error-handlers/404.js");

// Prepare the express app
const app = express();
const PORT = process.env.PORT || 9000;

const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// App Level MW
app.use(cors());

// Routes

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
