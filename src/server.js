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
const aRouter = require("./auth/routes/routes.js");
const errorHandler = require("./error-handlers/500");
const notFound = require("./error-handlers/404.js");

// Prepare the express app
const app = express();



const Router = express.Router();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "../public"));
app.set("views", __dirname + "/../public/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Database

const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// ****************
// // const pgDB = Client.connect
// const AdminBro = require('admin-bro')
// const AdminBroSequelize = require('@admin-bro/sequelize')
// const AdminBroExpress = require('admin-bro-expressjs')
// AdminBro.registerAdapter(AdminBroSequelize)

// const db = require("../DataBase/schema.sql");
// const adminBro = new AdminBro({
//   databases: [db],
//   rootPath: '/',
// });
// const router = AdminBroExpress.buildRouter(adminBro)
// app.use(adminBro.options.rootPath, router);
// ***************




// JWT configuration

const secretKey = process.env.SECRET_KEY;
const secretKeyRefresher = process.env.SECRET_KEY_REFRESHER;

// App Level MW
app.use(cors());

// Routes
app.get("/volunteer/:id", handleGetVolunteerProfile);
app.put("/volunteer/:id", updateVolunteerProfile);

app.get("/volunteer/:id/host/:id", handleVolunteerViewingHost);
app.get("/volunteer/:id/host/:id/service/:id", handleVolunteerViewingHostService);

app.get("/host/:id", handleGetHostProfile);
app.put("/host/:id", updateHostProfile);
app.get("/host/:id/service", handleGetHostService);
app.post("/host/:id/service", createServiceProfile);
app.get("/host/:id/service/:id", handleOneHostService);
app.put("/host/:id/service/:id", updateServiceProfile);
app.delete("/host/:id/service/:id", deleteServiceProfile);
app.get("/host/:id/volunteer/:id", handleHostViewingVolunteer);

// app.get("/", handleHome);

app.get("/volunteers/sign_up", handleVolunteerForm);

app.post("/volunteers/sign_up", handleVolunteerSignup);

app.get("/hosts/sign_up", handleHostForm);

app.post("/searchResults", handleSearchBar);
app.get("/searchResults", handleDisplaySearch);

app.post("/hosts/sign_up", handleHostSignup);

app.get("/sign_in", handleSignInForm);

app.post("/sign_in",handleSignIn);

// functions
function handleSearchBar(req, res) {
  // Getting Data from Country API
  // console.log(req.body)
  const countryName = req.body.myCountry;
  const countryURL = `https://restcountries.eu/rest/v2/name/${countryName}`;
  return superagent.get(countryURL).then(data => {
    let countryNames = [];
    data.body.map(element => {
      countryNames.push(new Country(element));
    })
    console.log("countryNames",countryNames[0].country);
    const query = 'SELECT * FROM Service WHERE country=$1 OR title=$2';
    let safeValue = [countryNames[0].country, req.body.WorkField];
    client.query(query, safeValue).then(data => {
      console.log('Search results from DB: ', data.rows[0]);
      res.json({'searchResults': data.rows})
    }).catch(err =>{
      console.log(`error in getting search results from DB ${err}`);
    })
  }).catch(err => {
    res.json("Please enter a country name");
    console.log(`error in getting the Countries names from the API ${err}`)
  })

}

function handleDisplaySearch(req, res) {
  res.render('searchResults')
}

async function handleHome(req, res) {
  res.render("index");

  // const token = req.cookies.JWT_TOKEN;
  // if(token) {
  //   const user = await validateToken(token, JWT_SECRET);

  //   if(user === null) {
  //     res.send
  //   }
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

    if (searchResults.length === 0) {
      searchResults = await checkHostExists(formData.username);
    }
    if (searchResults.length === 0) {
      res.json("Error Incorrect username or password");
    } else {
      const hashedPassword = searchResults[0].password;
      const success = await bcrypt.compare(formData.password, hashedPassword);

      if (success === true) {
        // Check if the user volunteer or host
        if (!searchResults[0].category) {
          const payload = {id: searchResults[0].id, name: searchResults[0].user_name, role: "volunteer" }
          const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "15s" });
          const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESHER)

          // Store the refresh token in DB
          const updateQuery =
            "update volunteer set token = $1 where user_name = $2;";
          const safeValues = [refreshToken, searchResults[0].user_name];
          console.log(`Refresh token`, refreshToken);
          client.query(updateQuery, safeValues)
            .then(() => {
              console.log(`Updated the token`);
              res.json({
                username: searchResults[0].user_name,
                token : refreshToken
              })
            })
            .catch(error => {
              res.json('Error while updating the refresh token', error);
            })
          res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly; samesite=lax`])
          // res.send({ "success": "Logged in successfully!", "refreshToken": refreshtoken })
        } else if (searchResults[0].category) {
          const payload = {id: searchResults[0].id, name: searchResults[0].user_name, role: "host" }
          const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "15s" });
          const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESHER)
          
          // Store the refresh token in DB
          const updateQuery = "update host set token = $1 where user_name = $2;";
          const safeValues = [refreshToken, searchResults[0].user_name]

          client.query(updateQuery, safeValues)
            .then(data => {
              console.log(`Updated the token`);
              res.json({
                username: searchResults[0].user_name,
                token : refreshToken
              })
            })
            .catch((error) => {
              console.log("Error while updating the refresh token", error);
            });
          res.setHeader("set-cookie", [
            `JWT_TOKEN=${token}; httponly; samesite=lax`,
          ]);
          // res.send({ "success": "Logged in successfully!", "refreshToken": refreshtoken })
        } else {
          res.json("Error Incorrect username or password")
        }
      } else {
        res.json("Error Incorrect username or password")
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
      results = await checkHostExists(userName);
    }

    console.log("results", results);

    if (results.length === 0) {
      const formData = req.body;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      let insertQuery =
        "insert into volunteer(user_name, first_name, last_name, password, email, country, birth_date, address) values ($1, $2, $3, $4, $5, $6, $7, $8)";
      const safeValues = [
        formData.username,
        formData.first_name,
        formData.last_name,
        hashedPassword,
        formData.email,
        formData.country,
        formData.birth_date,
        formData.address,
      ];

      client
        .query(insertQuery, safeValues)
        .then((data) => {
          // console.log(`Volunteer added to the database`);
          res.json("success Volunteer created successfully");
        })
        .catch((error) => {
          // console.log('Error while creating the a volunteer', error)
          res.json("Error, Volunteer was not created successfully");
        })
    } else {
      res.json("Error Volunteer already exists");
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

    results = await checkHostExists(userName);

    if (results.length === 0) {
      results = await checkVolunteerExists(userName);
    }

    console.log("results", results);

    if (results.length === 0) {
      const formData = req.body;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      let insertQuery =
        "insert into host(user_name, first_name, last_name, password, email, country, birth_date, address, category) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
      const safeValues = [
        formData.username,
        formData.first_name,
        formData.last_name,
        hashedPassword,
        formData.email,
        formData.country,
        formData.birth_date,
        formData.address,
        formData.category,
      ];

      client
        .query(insertQuery, safeValues)
        .then((data) => {
          console.log(`Host added to the database`);
          res.json("success Host created successfully");
        })
        .catch(error => {
          res.json("Error Host was not created successfully");
        })
    } else {
      res.json("Error Host already exists");
    }
  } catch (e) {
    res.send(e.message);
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

function verifyToken(req, res, next) {
  
}


// Catchalls
app.use(notFound);
app.use(errorHandler);

// functions
async function checkHostUserName(username) {
  let searchQ = `select * from host where user_name = $1`;
  let safeValues = [username];
  let data = await client.query(searchQ, safeValues);
  console.log(data.rowCount);
  if (data.rowCount === 0) {
    return false;
  } else return true;
}
async function checkHostEmail(email) {
  let searchQ = `select * from host where email = $1`;
  let safeValues = [email];
  let data = await client.query(searchQ, safeValues);
  console.log(data.rowCount);
  if (data.rowCount === 0) {
    return false;
  } else return true;
}

async function checkVolunteerUserName(username) {
  let searchQ = `select * from volunteer where user_name = $1`;
  let safeValues = [username];
  let data = await client.query(searchQ, safeValues);
  console.log(data.rowCount);
  if (data.rowCount === 0) {
    return false;
  } else return true;
}
async function checkVolunteerEmail(email) {
  let searchQ = `select * from volunteer where email = $1`;
  let safeValues = [email];
  let data = await client.query(searchQ, safeValues);
  console.log(data.rowCount);
  if (data.rowCount === 0) {
    return false;
  } else return true;
}

async function handleGetVolunteerProfile(req, res) {
  let id = req.params.id;
  // let newValue = req.body;
  // console.log(newValue);
  let selectQ = `select * from volunteer where id = $1;`;
  let data = await client.query(selectQ, [id]);
  res.json(data.rows[0]);
}

async function updateVolunteerProfile(req, res) {
  let userCheck = await checkVolunteerUserName(req.body.user_name);
  let mailCheck = await checkVolunteerEmail(req.body.email);
  if (userCheck) {
    res.json("Username is already exists");
    return;
  }
  if (mailCheck) {
    res.json("Email is already exists");
    return;
  }
  let id = req.params.id;
  let selectQ = `update volunteer set user_name=$1,first_name=$2,last_name=$3,
  password=$4,description=$5,country=$6,birth_date=$7,skills=$8,
  address=$9,rating=$10, profile_image=$11 , passport = $12, email= $13 
  where id = $14 RETURNING *;`;
  let safeValues = [
    req.body.user_name,
    req.body.first_name,
    req.body.last_name,
    req.body.password,
    req.body.description,
    req.body.country,
    req.body.birth_date,
    req.body.skills,
    req.body.address,
    req.body.rating,
    req.body.profile_image,
    req.body.passport,
    req.body.email,
    id,
  ];
  let data = await client.query(selectQ, safeValues);
  res.json(data.rows[0]);
}

async function updateHostProfile(req, res) {
  let userCheck = await checkHostUserName(req.body.user_name);
  let mailCheck = await checkHostEmail(req.body.email);
  if (userCheck) {
    res.json("Username is already exists");
    return;
  }
  if (mailCheck) {
    res.json("Email is already exists");
    return;
  }
  let id = req.params.id;
  let selectQ = `update host set user_name=$1,first_name=$2,last_name=$3,
  password=$4,description=$5,country=$6,birth_date=$7,category=$8,
  address=$9,rating=$10,profile_image=$11 
  where id = $12 RETURNING *;`;
  let safeValues = [
    req.body.user_name,
    req.body.first_name,
    req.body.last_name,
    req.body.password,
    req.body.description,
    req.body.country,
    req.body.birth_date,
    req.body.category,
    req.body.address,
    req.body.rating,
    req.body.profile_image,
    id,
  ];
  let data = await client.query(selectQ, safeValues);
  res.json(data.rows);
}
async function createServiceProfile(req, res) {
  console.log("create id ", req.params.id);
  let host_id = req.params.id;
  let selectQ = `insert into service  (title,description,country,
  type,details,duration,from_date,to_date,working_hours,
  working_days,minumim_age,address,profile_image,host_id)
  values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)  RETURNING *;`;

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
    host_id,
  ];

  let data = await client.query(selectQ, safeValues);
  res.redirect(`/host/${host_id}/service`);
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

async function handleVolunteerViewingHost(req, res) {
  let id = req.params.id;

  let selectHostQuery = `select * from host where id =$1;`;
  let host = await client.query(selectHostQuery, [id]);
  let selectServiceQuery = `select * from service where host_id =$1;`
  let services = await client.query(selectServiceQuery, [id]);
  res.json({
    host:host.rows[0],
    services: services.rows
  });
}

async function handleVolunteerViewingHostService(req, res) {
  let id = req.params.id;

  let selectHost_idQuery = `select host_id from service where id = $1;`;
  let host = await client.query(selectHost_idQuery, [id]);

  let host_id = host.rows[0].host_id
  let selectServiceQuery = `select * from service where host_id = $1 AND id = $2;`;
  let safeValues = [host_id, id]
  let service = await client.query(selectServiceQuery, safeValues);
  res.json(service.rows[0]);
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
  let selectQ = `select * from service where host_id = $1;`;
  let safeValues = [id];
  let data = await client.query(selectQ, safeValues);
  res.json(data.rows);
}
async function handleOneHostService(req, res) {
  let id = req.params.id;
  console.log(req.params);
  let selectQ = `select * from service where id = $1;`;
  let safeValues = [id];
  let data = await client.query(selectQ, safeValues);
  res.json(data.rows);
}
async function deleteServiceProfile(req, res) {
  let id = req.params.id;

  let safeValues = [id];
  let selectHost = `select host_id from service where id =$1;`;
  let host_id = await client.query(selectHost, safeValues);
  let selectQ = `delete from service where id = $1;`;
  let data = await client.query(selectQ, safeValues);
  res.redirect(`/host/${host_id.rows[0].host_id}/service`);
}

async function handleHostViewingVolunteer(req, res) {
  let id = req.params.id;

  let selectVolunteerQuery = `select * from volunteer where id =$1;`;
  let volunteer = await client.query(selectVolunteerQuery, [id]);
  res.json(volunteer.rows[0]);
}
//constructors
function Country(data) {
  this.country = data.name;
  this.flag = data.flag;
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
}
