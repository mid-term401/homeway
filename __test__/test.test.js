"use strict";
require("dotenv").config();
const { server } = require("../src/server");
const superTest = require("supertest");
const base64 = require("base-64");
const client = require("../DataBase/data");
const request = superTest(server);
describe("Server", () => {
  // Error Handlers
  it("should successfully handle invalid routes", async () => {
    const response = await request.get("/random");
    expect(response.status).toEqual(404);
  });
  it("should successfully handle server errors", async () => {
    const response = await request.get("/error");
    expect(response.status).toEqual(500);
  });
  // Test Country API:
  it("should successfully return data from API", async () => {
    const response = await request.post("/searchResults").send({});
    expect(response.body).toEqual(200);
  });
  it("should successfully return data from API", async () => {
    const response = await request.get("/searchResults");
    expect(response.status).toEqual(200);
  });
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
  // Testing CRUD:
  //   it("should successfully get volunteer profile information", async () => {
  //     const res = await request.post("/hosts/sign_up").send({
  //       username: "Bo",
  //       password: "1994",
  //     });
  //     const response = await request.get("/volunteer/id");
  //     expect(response.status).toBe(200);
  //   });
});
