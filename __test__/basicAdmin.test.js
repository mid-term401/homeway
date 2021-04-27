"use strict";
require("dotenv").config();
const { server } = require("../src/server.js");
const superTest = require("supertest");
const base64 = require("base-64");
const client = require("../DataBase/data");
const request = superTest(server);



let user={
    user_name: "Admin2",
    password: "admin123",
};

describe('Signing test', () => {
    beforeAll(async () => {
        await client.connect();
      });
//   it('should successfully create a new User on POST /signup', async () => {
//     const response = await request.post('/superuser').send(user);
//     expect(response.status).toEqual(200);
//   });
  it('should successfully find user data when login on POST /signin', async () => {
    const response = await request
      .post('/sign_in')
      .set(
        'Authorization',
        'basic ' + new Buffer.from(`${user.user_name}:${user.password}`, 'utf8').toString('base64'),
      );
    expect(response.status).toEqual(200);
  });

  it('should send an error if the username is incorrect on POST /signin', async () => {
    const response = await request
      .post('/superuser')
      .set(
        'Authorization',
        'basic ' + new Buffer.from(`Moh:${user.password}`, 'utf8').toString('base64'),
      );
    //   console.log('-----------------------', response)
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('\"Error Incorrect username or password\"');
  });

  it('should send an error if the password is incorrect on POST /signin', async () => {
    const response = await request
      .post('/superuser')
      .set(
        'Authorization',
        'basic ' + new Buffer.from(`${user.user_name}:12345`, 'utf8').toString('base64'),
      );
    expect(response.status).toEqual(200);
    expect(response.text).toEqual('\"Error Incorrect username or password\"');
  });
  afterAll(async () => {
    await client.end();
  });
});