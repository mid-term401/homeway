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
app.get("/host/:id", handleGetHostProfile);
app.put("/host/:id", updateHostProfile);
app.post("/host/:id/service", createServiceProfile);
app.put("/host/:id/service/:id", updateServiceProfile);
app.delete("/host/:id/service/:id", deleteServiceProfile);
app.get("/host/:id/service/:id", handleGetHostService);

app.get("/", handleHome);

app.get("/volunteers/sign_up", handleVolunteerForm);

app.post("/volunteers/sign_up", handleVolunteerSignup);

app.get("/hosts/sign_up", handleHostForm);

app.post('/searchResults', handleSearchBar)
app.get('/searchResults', handleDisplaySearch)

app.post("/hosts/sign_up", handleHostSignup);

app.get("/sign_in", handleSignInForm);

app.post("/sign_in", verifyToken ,handleSignIn);


// functions Samer
function handleSearchBar(req, res){

  console.log(req.body)
  const countryName = req.body.myCountry;
  const countryURL = `https://restcountries.eu/rest/v2/name/${countryName}`;
  return superagent.get(countryURL).then( data=>{
    let countryNames = [];
    data.body.map(element =>{
      countryNames.push( new Country(element));
    })
    console.log(countryNames);
        // const query='SELECT * FROM services WHERE country=$1 && workField=$2';
  // let safeValue = [req.body.myCountry, req.body.WorkField];
  // client.query(query,safeValue).then(data=>{
  //   console.log(data.rows);
  //   res.render('searchResults',{"data":data.rows})
  // })
    // return countryNames;
    // res.send(countryNames)
  }).catch(err => {
    console.log(`error in getting the Countries names from the API ${err}`)
  })
}
function handleDisplaySearch(req,res){
  res.render('searchResults')
}

async function handleHome(req, res) {
  res.render("index");

  const token = req.cookies.JWT_TOKEN;
  if(token) {
    const user = await validateToken(token, JWT_SECRET);

    if(user === null) {
      res.send
    }
  }
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
      searchResults = await checkHostExists(formData.username)
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
          const updateQuery = "update volunteer set token = $1 where user_name = $2;";
          const safeValues = [refreshToken, searchResults[0].user_name]
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
            .catch(error => {
              console.log('Error while updating the refresh token', error)
            })
          res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly; samesite=lax`])
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
          res.json("success Volunteer created successfully");
        })
        .catch(error => {
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

function verifyToken(req, res, next) {
  
}


// Catchalls
app.use(notFound);
app.use(errorHandler);


// functions Ibrahim

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

//constructors 
function Country(data){
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
