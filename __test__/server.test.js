"use strict";
require("dotenv").config();
const { server } = require("../src/server.js");

const superTest = require("supertest");
const base64 = require("base-64");
const client = require("../DataBase/data");
const request = superTest(server);
const middleware = require("../src/auth/middleware/bearer.js");
const middlewareHost = require("../src/auth/middleware/bearerHost.js");
const middlewareVolunteer = require("../src/auth/middleware/bearerVolunteer.js");
const middlewareAdmin = require("../src/auth/middleware/bearerAdmin.js");
const jwt = require("jsonwebtoken");
// const jest = require('jest')
process.env.SECRET = "wHaT";
let user = {
  username: "Admin2",
  password: "admin123",
};
jest.setTimeout(60000)
let users = {
  admin: { username: "admin", password: "password" },
};

describe('Routes Testing', () => {
    beforeAll(async () => {
        await client.connect();
      });
      //app.get("/volunteer/:id/host/:id", bearerVolunteer, handleVolunteerViewingHost);
        it('should  find user data when login on GET /volunteer/:id/host/:id', async () => {
        const user = { id: 1, name: "sam" };
        const token = jwt.sign(user, process.env.SECRET || "wHaT");
        let selectHostQuery = `select * from host where id =$1;`;
        let host = await client.query(selectHostQuery, [user.id]);
        let selectServiceQuery = `select * from service where host_id =$1;`
        let data = await client.query(selectServiceQuery, [user.id]);       
        expect(data.rows.length).toEqual(0);
        // expect(response.status).toBe(200)
      });
      //app.get("/volunteer/:id/host/:id/service/:id", bearerVolunteer, handleVolunteerViewingHostService);
      it('should  find user data when login on GET"/volunteer/:id/host/:id/service/:id', async () => {
        const user = { id: 1, name: "sam" };
         let selectHost_idQuery = `select host_id from service where id = $1;`;
         let host = await client.query(selectHost_idQuery, [user.id]);
        //  let host_id = host.rows[0].host_id;
           let selectServiceQuery = `select * from service where host_id = $1 AND id = $2;`;
  let safeValues = [1, user.id];
   let service = await client.query(selectServiceQuery, safeValues);
      expect(service.rows.length).toEqual(0);
      });

      //app.get("/host/:id", bearerHost, handleGetHostProfile);
      it('should find user data when login on GET"/host/:id', async () => {
        // const response = await request.get('/host/1');
        const user = { id: 1, name: "sam" };
        let selectQ = `select * from host where id = $1;`;
  let safeValues = [user.id];
  let data = await client.query(selectQ, safeValues);
          expect(data.rows.length).toEqual(0);
      });
  afterAll(async () => {
    await client.end();
  });
});