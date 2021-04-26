"use strict";
require("dotenv").config();
const { server } = require("../src/server.js");
const superTest = require("supertest");
const base64 = require("base-64");
const client = require("../DataBase/data");
const request = superTest(server);

let user = {
  username: "Admin2",
  password: "admin123",
};

describe("Server", () => {
  beforeAll(async () => {
    await client.connect();
  });
  // Error Handlers
  //   it("should successfully handle invalid routes", async () => {
  //     const response = await request.get("/random");
  //     expect(response.status).toEqual(404);
  //   });
  //   it("should successfully handle server errors", async () => {
  //     const response = await request.get("/");
  //     expect(response.status).toEqual(200);
  //   });
  //   // Test Country API:
  //   it("should successfully return data from API", async () => {
  //     const response = await request.post("/searchResults").send({
  //       myCountry: "jordan",
  //       WorkField: "test",
  //     });
  //     expect(response.status).toEqual(200);
  //   });
  //   it("should successfully return data from API", async () => {
  //     const response = await request.get("/searchResults");
  //     expect(response.status).toEqual(200);
  //   });
  //   // Test Signing up for volunteer and host
  //   it("should successfully create a new volunteer user upon signing up as a volunteer", async () => {
  //     const response = await request.post("/volunteers/sign_up").send({
  //       username: "Mohammad",
  //       password: "1994",
  //     });
  //     expect(response.status).toEqual(200);
  //   });
  //   it("should successfully create a new host user upon signing up as a host", async () => {
  //     const response = await request.post("/hosts/sign_up").send({
  //       username: "Boshra",
  //       password: "1994",
  //     });
  //     expect(response.status).toEqual(200);
  //   });
  //   // Test Signing in for volunteer and host
  //   it("should successfully log in as a volunteer upon signing in", async () => {
  //     const user = base64.encode("Mohammad:1994");
  //     const response = await request
  //       .post("/sign_in")
  //       .set("Authorization", `Basic ${user}`);
  //     expect(response.status).toEqual(200);
  //   });
  //   it("should successfully log in as a host upon signing in", async () => {
  //     const user = base64.encode("Boshra:1994");
  //     const response = await request
  //       .post("/sign_in")
  //       .set("Authorization", `Basic ${user}`);
  //     expect(response.status).toEqual(200);
  //   });
  //   // Testing CRUD:
  //   it("should successfully create host ", async () => {
  //     const res = await request.post("/hosts/sign_up").send({
  //       username: "boshrsa^22",
  //       password: "0000",
  //       first_name: "samer",
  //       last_name: "alnajjar",
  //       email: "amass.nse2to",
  //       country: "s",
  //       address: "s",
  //       birth_date: "12-12-2021",
  //       category: "aya yshe",
  //     });

  //     expect(res.status).toBe(200);
  //   });
  //   it("should successfully get get the host profile", async () => {
  //     const res = await request.get("/hosts/sign_up");
  //     expect(res.status).toBe(200);
  //   });
  //   it("should create volunteer account", async () => {
  //     const response = await request.post("/volunteers/sign_up").send({
  //       user_name: "ibrahim",
  //       first_name: "samer",
  //       last_name: "alnajjar",
  //       password: "$2b$10$eqYmuEEgRy./wjdIf7dkpO08x/dvj/tzoh71AtA4PvdZBOKGUUunG",
  //       description: null,
  //       email: "amazin2g.com0",
  //       country: "jordan",
  //       birth_date: "2021-12-11T22:00:00.000Z",
  //       category: "aya yshe",
  //       address: "s",
  //       rating: null,
  //       profile_image: null,
  //     });
  //     expect(response.status).toBe(200);
  //   });
  //   it("should successfully get the volunteers profile", async () => {
  //     const res = await request.get("/volunteers/sign_up");
  //     expect(res.status).toBe(200);
  //   });
  //   it("should successfully sign in", async () => {
  //     const res = await request.get("/sign_in").send({
  //       user_name: "8000",
  //       password: "0000",
  //     });
  //     expect(res.status).toBe(200);
  //   });
  //   it("should admin find host profile ", async () => {
  //     const response = await request
  //       .get("/superuser/host/1")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(200);
  //     // expect(response.body.user_name).toEqual("8000");
  //   });
  //   it("should admin find volunteer profile", async () => {
  //     const response = await request
  //       .get("/superuser/volunteer/1")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(200);
  //   });

  //   it("should admin find volunteer profile", async () => {
  //     const response = await request
  //       .get("/superuser/service/1")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(200);
  //   });
  //   it("should admin update service ", async () => {
  //     const response = await request
  //       .put("/superuser/service/1")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(200);
  //   });
  //   it("should admin update volunteer profile", async () => {
  //     const response = await request
  //       .put("/superuser/volunteer/1")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(200);
  //   });
  //   it("should admin update host profile", async () => {
  //     const response = await request
  //       .put("/superuser/host/1")
  //       .send({
  //         username: "boshrsa^22",
  //         password: "0000",
  //         first_name: "samer",
  //         last_name: "alnajjar",
  //         email: "amass.nse2to",
  //         country: "s",
  //         address: "s",
  //         birth_date: "12-12-2021",
  //         category: "aya yshe",
  //       })
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(200);
  //   });
  //   it("should admin delete volunteer profile", async () => {
  //     const response = await request
  //       .delete("/superuser/volunteer/1")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(302);
  //   });
  //   it("should admin delete host profile", async () => {
  //     const response = await request
  //       .delete("/superuser/host/1")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(302);
  //   });
  //   it("should admin delete service profile", async () => {
  //     const response = await request
  //       .delete("/superuser/service/1")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(302);
  //   });
  //   it("should admin go to the admin page", async () => {
  //     const response = await request
  //       .post("/superuser")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(200);
  //   });
  //   it("should admin update volunteer profile", async () => {
  //     const response = await request
  //       .post("/sign_in")
  //       .set(
  //         "Authorization",
  //         "basic " +
  //           new Buffer.from(`${user.username}:${user.password}`, "utf8").toString(
  //             "base64"
  //           )
  //       );
  //     expect(response.status).toEqual(200);
  //   });

  afterAll(async () => {
    await client.end();
  });
});
