"use strict";

// 3rd Party Resources
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const superagent = require("superagent");
const pg = require("pg");

// Esoteric Resources
const aRouter = require("./auth/routes/routes.js");
const errorHandler = require("./error-handlers/500");
const notFound = require("./error-handlers/404.js");

// Prepare the express app
const app = express();
const Router = express.Router();
const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// App Level MW
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/host/:id", handleGetHostProfile);
app.put("/host/:id", updateHostProfile);
app.post("/host/:id/service", createServiceProfile);
app.put("/host/:id/service/:id", updateServiceProfile);
app.delete("/host/:id/service/:id", deleteServiceProfile);
app.get("/host/:id/service/:id", handleGetHostService);

// app.use(aRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

// functions

async function updateHostProfile(req, res) {
  let id = req.params.id;
  // console.log(req.body);
  let selectQ = `update host set user_name=$1,first_name=$2,last_name=$3,
  password=$4,description=$5,email=$6,country=$7,birth_date=$8,category=$9,
  details=$10,skills=$11,passport=$12,address=$13,rating=$14,profile_image=$15 
  where id = $16 RETURNING *;`;
  let safeValues = [
    req.body.user_name,
    req.body.first_name,
    req.body.last_name,
    req.body.password,
    req.body.description,
    req.body.email,
    req.body.country,
    req.body.birth_date,
    req.body.category,
    req.body.details,
    req.body.skills,
    req.body.passport,
    req.body.address,
    req.body.rating,
    req.body.profile_image,
    id,
  ];
  console.log(safeValues);
  let data = await client.query(selectQ, safeValues);
  res.json(data.rows);
}
async function createServiceProfile(req, res) {
  console.log(req.body);
  let selectQ = `insert into service  (title,description,country,
  type,details,duration,from_date,to_date,working_hours,
  working_days,minumim_age,address,profile_image)
  values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *;`;

  let safeValues = [
    req.body.title,
    req.body.description,
    req.body.country,
    req.body.type,
    req.body.details,
    req.body.duration,
    req.body.from_date,
    req.body.to_date,
    req.body.working_hours,
    req.body.working_days,
    req.body.minumim_age,
    req.body.address,
    req.body.profile_image,
  ];
  let data = await client.query(selectQ, safeValues);
  let id = data.rows[0].id;
  console.log(id);
  console.log(`/service${id}`);
  res.redirect(`/host/${8}`);
}

async function updateServiceProfile(req, res) {
  let id = req.params.id;
  console.log(req.body);
  let selectQ = `update service set title=$1,description=$2,country=$3,
  type=$4,details=$5,duration=$6,from_date=$7,to_date=$8,working_hours=$9,
  working_days=$10,minumim_age=$11,address=$12,profile_image=$13
  where id = $14 RETURNING *;`;
  let safeValues = [
    req.body.title,
    req.body.description,
    req.body.country,
    req.body.type,
    req.body.details,
    req.body.duration,
    req.body.from_date,
    req.body.to_date,
    req.body.working_hours,
    req.body.working_days,
    req.body.minumim_age,
    req.body.address,
    req.body.profile_image,
    id,
  ];
  let data = await client.query(selectQ, safeValues);
  res.json(data.rows);
}
async function handleGetHostProfile(req, res) {
  let id = req.params.id;
  let newValue = req.body;
  console.log(newValue);
  let selectQ = `select * from host where id = $1;`;
  let safeValues = [id];
  let data = await client.query(selectQ, safeValues);
  res.json(data.rows);
}
async function handleGetHostService(req, res) {
  let id = req.params.id;
  console.log(id);
  let selectQ = `select * from service where id = $1;`;
  let safeValues = [id];
  let data = await client.query(selectQ, safeValues);
  res.json(data.rows);
}
async function deleteServiceProfile(req, res) {
  let id = req.params.id;
  console.log(id);
  let selectQ = `delete from service where id = $1;`;
  let safeValues = [id];
  let data = await client.query(selectQ, safeValues);
  res.redirect(`/host/${8}`);
}

module.exports = {
  start: (PORT) => {
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
  },
};
