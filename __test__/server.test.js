// "use strict";
// require("dotenv").config();
// const { server } = require("../src/server.js");

// const superTest = require("supertest");
// const base64 = require("base-64");
// const client = require("../DataBase/data");
// const request = superTest(server);
// const middleware = require("../src/auth/middleware/bearer.js");
// const basic = require("../src/auth/middleware/basic")
// const middlewareHost = require("../src/auth/middleware/bearerHost.js");
// const middlewareVolunteer = require("../src/auth/middleware/bearerVolunteer.js");
// const middlewareAdmin = require("../src/auth/middleware/bearerAdmin.js");
// const jwt = require("jsonwebtoken");
// // const jest = require('jest')
// process.env.SECRET = "wHaT";

// describe('Routes Testing', () => {
//     beforeAll(async () => {
//         await client.connect();
//       });
//    // app.get("/volunteer/:id/host/:id/service/:id", bearerVolunteer, handleVolunteerViewingHost);

//    it('should find user data when login on GET /volunteer/:id/host/:id', async () => {
//     const resSignupHost = await request.post("/hosts/sign_up").send({
//         username:"ib000",
//         password:"0000",
//         first_name:"samer00",
//         last_name:"alnajjar00",
//         email:"a1000",
//         country:"s",
//         address:"s",
//         birth_date:"12-12-2021",
//         category:"farming"
//     });
//     const resSignInHost = await request.post('/sign_in').send({
//       username:"ib000",
//         password:"0000",
//     }).set( "Authorization",
//     "basic " +
//       new Buffer.from(`ib000:0000`, "utf8").toString(
//         "base64"
//       ));
//       let usernameHost = await client.query('select * from host where user_name=$1', [resSignInHost.body.username]);

//       const resSignupVolunteer = await request.post("/volunteers/sign_up").send({
//         username:"30",
//         password:"0000",
//         first_name:"samer00",
//         last_name:"alnajjar00",
//         email:"30",
//         country:"s",
//         address:"s",
//         birth_date:"12-12-2021",
//         category:"farming"
//     });
//     const resSignInVolunteer = await request.post('/sign_in').send({
//       username:"30",
//         password:"0000",
//     }).set( "Authorization",
//     "basic " +
//       new Buffer.from(`30:0000`, "utf8").toString(
//         "base64"
//       ));
//      let username = await client.query('select * from volunteer where user_name=$1', [resSignInVolunteer.body.username])
//     let HostToken = resSignInHost.body.token

//     const response = await request.get(`/volunteer/${username.rows[0].id}/host/${usernameHost.rows[0]}/service/`).set(
//       "Authorization",
//       "bearer " +
//         new Buffer.from(`${HostToken}`, "utf8")
//     )
//      expect(1).toBe(1);
//      expect(response.status).toBe(200)
//   });

//   afterAll(async () => {
//     await client.end();
//   });
// });
