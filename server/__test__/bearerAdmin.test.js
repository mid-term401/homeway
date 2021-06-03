// "use strict";
// require("dotenv").config();
// const { server } = require("../src/server.js");
// const superTest = require("supertest");
// const base64 = require("base-64");
// const client = require("../DataBase/data");
// const request = superTest(server);
// const middleware = require('../src/auth/middleware/bearerAdmin');
// const jwt = require('jsonwebtoken');

// process.env.SECRET = "toes";

// let user={
//     user_name: "Mohammad",
//     password: "1994",
// };

//  describe("Auth Middleware", () => {
//      beforeAll(async () => {
//         await client.connect();
//       });
//        afterAll(async () => {
//     await client.end();
//   });
//     // Mock the express req/res/next that we need for each middleware call
//     const req = {};
//     const res = {
//       status: jest.fn(() => res),
//       send: jest.fn(() => res),
//     };
//     const next = jest.fn();

//     describe("user authentication", () => {
//       it("fails a login for a user (host) with an incorrect token", () => {
//         req.headers = {
//           authorization: "Bearer thisisabadtoken",
//         };

//         return middleware(req, res, next).then(() => {
//           expect(next).not.toHaveBeenCalled();
//           expect(res.status).toHaveBeenCalledWith(403);
//         });
//       });
//        it("logs in a user with a proper token", () => {
//         const user = { name: "admin", id: 1 };
//         const token = jwt.sign(user, process.env.SECRET || "wHaT");

//         req.headers = {
//           authorization: `Bearer ${token}`,
//         };

//         return middleware(req, res, next).then(() => {
//           //  console.log('------------', res)
//           expect(res.status).toHaveBeenCalledWith(403);
//         });
//       })
//     })
//  })
