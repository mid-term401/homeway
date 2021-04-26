"use strict";

// 3rd Party Resources
const express = require("express");
const socketio = require('socket.io')
const Filter = require('bad-words')
const http = require('http')

const client = require("../DataBase/data");

const cors = require("cors");
require("dotenv").config();

const cookieParser = require("cookie-parser");
require("dotenv").config();

// Esoteric Resources
// const aRouter = require("./auth/routes/routes.js");
const errorHandler = require("./error-handlers/500");
const notFound = require("./error-handlers/404.js");

// Prepare the express app
const app = express();
app.use(cors());

const Router = express.Router();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "../public"));
app.set("views", __dirname + "/../public/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Requiring files
const basicAuth = require("./auth/middleware/basic");
const basicAdmin = require("./auth/middleware/basicAdmin");
const bearerAuth = require("./auth/middleware/bearer");
const bearerVolunteer = require("./auth/middleware/bearerVolunteer");
const bearerHost = require("./auth/middleware/bearerHost");
// const { generateMessage } = require('./utils/messages')
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')


const {
  handleSearchBar,
  handleDisplaySearch,
  handleHome,
  handleHostForm,
  handleSignInForm,
  handleSignIn,
  handleVolunteerSignup,
  handleHostSignup,
  handleVolunteerForm,
  handleGetVolunteerProfile,
  updateVolunteerProfile,
  updateHostProfile,
  createServiceProfile,
  updateServiceProfile,
  handleVolunteerViewingHost,
  handleVolunteerViewingHostService,
  handleGetHostProfile,
  handleGetHostService,
  handleOneHostService,
  deleteServiceProfile,
  handleHostViewingVolunteer,
  handleAdmin,
  handleAdminHost,
  handleAdminVolunteer,
  handleAdminHostService,
  deleteHostProfile,
  deleteVolunteerProfile,
  deleteServiceAdmin,
  addAdmin,
} = require("./auth/models/users");

// Database

// const client = new pg.Client(process.env.DATABASE_URL);

// const secretKey = process.env.SECRET_KEY;
// const secretKeyRefresher = process.env.SECRET_KEY_REFRESHER;

// App Level MW
app.use(cors());

//AOuth 
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '828937553057-8gc5eli5vu3v2oig6rphup580sg33lj4.apps.googleusercontent.com'
const Gclient = new OAuth2Client(CLIENT_ID);

// Oauth

app.get('/', (req, res)=>{
  res.render('index')
})

app.get('/login', (req,res)=>{
  res.render('login');
})

app.post('/login', (req,res)=>{
  let token = req.body.token;

  async function verify() {
      const ticket = await Gclient.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
    }
    verify()
    .then(()=>{
        res.cookie('session-token', token);
        res.send('success')
    })
    .catch(console.error);

})

app.get('/profile', checkAuthenticated, (req, res)=>{
  let user = req.user;
  res.render('profile', {user});
})

app.get('/protectedRoute', checkAuthenticated, (req,res)=>{
  res.send('This route is protected')
})

app.get('/logout', (req, res)=>{
  res.clearCookie('session-token');
  res.redirect('/login')

})


function checkAuthenticated(req, res, next){

  let token = req.cookies['session-token'];

  let user = {};
  async function verify() {
      const ticket = await Gclient.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      user.name = payload.name;
      user.email = payload.email;
      user.picture = payload.picture;
    }
    verify()
    .then(()=>{
        req.user = user;
        next();
    })
    .catch(err=>{
        res.redirect('/login')
    })

}

// ****************************SOCKETIO*******************************
const server = http.createServer(app)
// const io = socketio(server)

// const activeUsers = new Set();

// io.on('connection', (socket) => {
// 	console.log('New user connected')

// 	//default username
// 	socket.username = "Anonymous"

//     //listen on change_username
//     socket.on('change_username', (data) => {
//         socket.username = data.username
//     })

//     //listen on new_message
//     socket.on('new_message', (data) => {
//         //broadcast the new message
//         io.sockets.emit('new_message', {message : data.message, username : socket.username});
//     })

//     //listen on typing
//     socket.on('typing', (data) => {
//     	socket.broadcast.emit('typing', {username : socket.username})
//     })
// })

// *******************************************************************



// Routes
app.get("/volunteer/:id", bearerVolunteer, handleGetVolunteerProfile);
app.put("/volunteer/:id", bearerVolunteer, updateVolunteerProfile);
app.get("/volunteer/:id/host/:id", bearerVolunteer, handleVolunteerViewingHost);
app.get("/volunteer/:id/host/:id/service/:id", bearerVolunteer, handleVolunteerViewingHostService);

app.get("/host/:id", bearerHost, handleGetHostProfile);
app.put("/host/:id", bearerHost, updateHostProfile);
app.get("/host/:id/service", bearerHost, handleGetHostService);
app.post("/host/:id/service", bearerHost, createServiceProfile);
app.get("/host/:id/service/:id", bearerHost, handleOneHostService);
app.put("/host/:id/service/:id", bearerHost, updateServiceProfile);
app.delete("/host/:id/service/:id", bearerHost, deleteServiceProfile);
app.get("/host/:id/volunteer/:id", bearerHost, handleHostViewingVolunteer);

// app.get("/", handleHome);

app.get("/volunteers/sign_up", handleVolunteerForm);

app.post("/volunteers/sign_up", handleVolunteerSignup);

app.get("/hosts/sign_up", handleHostForm);

app.post("/searchResults", handleSearchBar);
app.get("/searchResults", handleDisplaySearch);

app.post("/hosts/sign_up", handleHostSignup);

app.get("/sign_in", handleSignInForm);

app.post("/sign_in", basicAuth, handleSignIn);




// function verifyToken(req, res, next) {

// }

////////////////////////////////////
// Routes
app.get("/volunteer/:id", bearerVolunteer, handleGetVolunteerProfile);
app.put("/volunteer/:id", bearerVolunteer, updateVolunteerProfile);
app.get("/volunteer/:id/host/:id", bearerVolunteer, handleVolunteerViewingHost);
app.get(
  "/volunteer/:id/host/:id/service/:id",
  bearerVolunteer,
  handleVolunteerViewingHostService
);

app.get("/host/:id", bearerHost, handleGetHostProfile);
app.put("/host/:id", bearerHost, updateHostProfile);
app.get("/host/:id/service", bearerHost, handleGetHostService);
app.post("/host/:id/service", bearerHost, createServiceProfile);
app.get("/host/:id/service/:id", bearerHost, handleOneHostService);
app.put("/host/:id/service/:id", bearerHost, updateServiceProfile);
app.delete("/host/:id/service/:id", bearerHost, deleteServiceProfile);
app.get("/host/:id/volunteer/:id", bearerHost, handleHostViewingVolunteer);

// app.get("/", handleHome);

app.get("/volunteers/sign_up", handleVolunteerForm);

app.post("/volunteers/sign_up", handleVolunteerSignup);

app.get("/hosts/sign_up", handleHostForm);

app.post("/searchResults", bearerAuth, handleSearchBar);
app.get("/searchResults", handleDisplaySearch);

app.post("/hosts/sign_up", handleHostSignup);

app.get("/sign_in", handleSignInForm);

app.post("/sign_in", basicAuth, handleSignIn);

app.post("/superuser", basicAdmin, handleAdmin);

// app.post("/superuser" , addAdmin);


//admin\\

app.get("/superuser/host/:id", basicAdmin, handleAdminHost);
app.put("/superuser/host/:id", basicAdmin, updateHostProfile);
app.delete("/superuser/host/:id", basicAdmin, deleteHostProfile);

app.get("/superuser/volunteer/:id", basicAdmin, handleAdminVolunteer);
app.put("/superuser/volunteer/:id", basicAdmin, updateVolunteerProfile);
app.delete("/superuser/volunteer/:id", basicAdmin, deleteVolunteerProfile);

app.get("/superuser/host/:id/service/:id", basicAdmin, handleAdminHostService);
app.put("/superuser/host/:id/service/:id", basicAdmin, updateServiceProfile);
app.delete("/superuser/host/:id/service/:id", basicAdmin, deleteServiceAdmin);

// app.post("/superuserAdmin",basicAdmin, addAdmin);

// function verifyToken(req, res, next) {

// }

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  start: (PORT) => {
    client
      .connect()
      .then(() => {
        server.listen(PORT, () => {
          console.log(`SERVER IS HERE  ${PORT}`);
        });
      })
      .catch((error) => {
        console.log("Error while connecting to the DB ..", error);
      });
  },
};
