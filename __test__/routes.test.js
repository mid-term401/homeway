"use strict";
require("dotenv").config();
const { server } = require("../src/server.js");

const superTest = require("supertest");
const base64 = require("base-64");
const client = require("../DataBase/data");
const request = superTest(server);
const middleware = require("../src/auth/middleware/bearer.js");
const basic = require("../src/auth/middleware/basic")
const middlewareHost = require("../src/auth/middleware/bearerHost.js");
const middlewareVolunteer = require("../src/auth/middleware/bearerVolunteer.js");
const middlewareAdmin = require("../src/auth/middleware/bearerAdmin.js");
const jwt = require("jsonwebtoken");
// const jest = require('jest')
process.env.SECRET = "wHaT";

describe('Routes Testing', () => {
    beforeAll(async () => {
        await client.connect();
      });
      //app.get("/host/:id", bearerHost, handleGetHostProfile);
      it('should find user data when login on GET /host/:id', async () => {
        const resSignup = await request.post("/hosts/sign_up").send({
            username:"ib000",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignIn = await request.post('/sign_in').send({
          username:"ib000",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`ib000:0000`, "utf8").toString(
            "base64"
          ));
          let username = await client.query('select * from host  where user_name=$1', [resSignIn.body.username])
        let token = resSignIn.body.token
        // console.log(resSignIn.body);
        const response = await request.get(`/host/${username.rows[0].id}`).set(
          "Authorization",
          "bearer " +
            new Buffer.from(`${token}`, "utf8")
        )
         expect(1).toBe(1);
         expect(response.status).toBe(200)
      });
      it('should find user data when login on PUT"/host/:id', async () => {
        const resSignup = await request.post("/hosts/sign_up").send({
            username:"ib000",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignIn = await request.post('/sign_in').send({
          username:"ib000",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`ib000:0000`, "utf8").toString(
            "base64"
          ));
        
        let token = resSignIn.body.token;
        let userData = await client.query('select * from host where user_name=$1', [resSignIn.body.username])
        const response = await request.put(`/host/${userData.rows[0].id}`).send({
          username:"ib000111",
            password:"0000111",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"   
        }).set(
          "Authorization",
          "bearer " +
            new Buffer.from(`${token}`, "utf8")
        )
        // console.log();
         expect(1).toBe(1);
         expect(response.status).toBe(200)
      });
      it('should find user data when login on GET /host/:id/service', async () => {
        const resSignup = await request.post("/hosts/sign_up").send({
            username:"ib000",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignIn = await request.post('/sign_in').send({
          username:"ib000",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`ib000:0000`, "utf8").toString(
            "base64"
          ));
          let userData = await client.query('select * from host where user_name=$1', [resSignIn.body.username])
        let token = resSignIn.body.token
        // console.log(token);
        const response = await request.get(`/host/${userData.rows[0].id}/service`).set(
          "Authorization",
          "bearer " +
            new Buffer.from(`${token}`, "utf8")
        )
         expect(1).toBe(1);
         expect(response.status).toBe(200)
      });
      it('should find user data when login on POST /host/:id/service', async () => {
        const resSignup = await request.post("/hosts/sign_up").send({
            username:"ib000",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignIn = await request.post('/sign_in').send({
          username:"ib000",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`ib000:0000`, "utf8").toString(
            "base64"
          ));
          let userData = await client.query('select * from host where user_name=$1', [resSignIn.body.username])
        let token = resSignIn.body.token
        console.log(resSignIn.body);
        const response = await request.post(`/host/${userData.rows[0].id}/service`).send({
        title: "ibtest2",
        description: "go awwwym",
        country: "s",
        type: "idont know",
        details: "sayesssm",
        duration: "2days",
        from_date: "1995-05-03T21:00:00.000Z",
        to_date: "1995-03-05T22:00:00.000Z",
        working_hours: "54days",
        working_days: "tokyo albg3a",
        minumim_age: 52,
        address: "s",
        profile_image: null,
        host_id : 28,
      }).set(
          "Authorization",
          "bearer " +
            new Buffer.from(`${token}`, "utf8")
        )
         expect(1).toBe(1);
         expect(response.status).toBe(302)
      });
      it('should find user data when login on GET /host/:id/volunteer/:id', async () => {
        const resSignupHost = await request.post("/hosts/sign_up").send({
            username:"ib000",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignInHost = await request.post('/sign_in').send({
          username:"ib000",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`ib000:0000`, "utf8").toString(
            "base64"
          ));
          let usernameHost = await client.query('select * from host where user_name=$1', [resSignInHost.body.username]);

          const resSignupVolunteer = await request.post("/volunteers/sign_up").send({
            username:"30",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"30",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignInVolunteer = await request.post('/sign_in').send({
          username:"30",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`30:0000`, "utf8").toString(
            "base64"
          ));
         let username = await client.query('select * from volunteer where user_name=$1', [resSignInVolunteer.body.username])
        let HostToken = resSignInHost.body.token
        
        const response = await request.get(`/host/${usernameHost.rows[0]}/volunteer/${username.rows[0].id}`).set(
          "Authorization",
          "bearer " +
            new Buffer.from(`${HostToken}`, "utf8")
        )
         expect(1).toBe(1);
         expect(response.status).toBe(200)
      });
      it('should find user data when login on PUT /host/:id/service/:id', async () => {
        const resSignup = await request.post("/hosts/sign_up").send({
            username:"ib000",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignIn = await request.post('/sign_in').send({
          username:"ib000",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`ib000:0000`, "utf8").toString(
            "base64"
          ));
          let userData = await client.query('select * from host where user_name=$1', [resSignIn.body.username])
        let token = resSignIn.body.token
        // console.log(resSignIn.body);
        const resService = await request.post(`/host/${userData.rows[0].id}/service`).send({
          title: "ibtest2",
          description: "go awwwym",
          country: "s",
          type: "idont know",
          details: "sayesssm",
          duration: "2days",
          from_date: "1995-05-03T21:00:00.000Z",
          to_date: "1995-03-05T22:00:00.000Z",
          working_hours: "54days",
          working_days: "tokyo albg3a",
          minumim_age: 52,
          address: "s",
          profile_image: null,
          host_id : 28,
        }).set(
            "Authorization",
            "bearer " +
              new Buffer.from(`${token}`, "utf8")
          )
          let serviceData = await client.query('select * from Service where host_id=$1', [userData.rows[0].id])
          // console.log('service',serviceData.rows[0]);
          
        const response = await request.put(`/host/${userData.rows[0].id}/service/${serviceData.rows[0].id}`).send({
            "title": "Hello I am Updated",
            "description": "go awwwym",
            "country": "Jordan",
            "type": "idont know",
            "details": "sayesssm",
            "duration": "2days",
            "from_date": "1995-05-03T21:00:00.000Z",
            "to_date": "1995-03-05T22:00:00.000Z",
            "working_hours": "54days",
            "working_days": "tokyo albg3a",
            "minumim_age": 52,
            "address": "usa",
            "profile_image": null
        }).set(
          "Authorization",
          "bearer " +
            new Buffer.from(`${token}`, "utf8")
        )
         expect(1).toBe(1);
         expect(response.status).toBe(200)
      }); 
      it('should find user data when login on DELETE /host/:id/service/:id', async () => {
        const resSignup = await request.post("/hosts/sign_up").send({
            username:"ib000",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignIn = await request.post('/sign_in').send({
          username:"ib000",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`ib000:0000`, "utf8").toString(
            "base64"
          ));
          let userData = await client.query('select * from host where user_name=$1', [resSignIn.body.username])
        let token = resSignIn.body.token
        // console.log(resSignIn.body);
        const resService = await request.post(`/host/${userData.rows[0].id}/service`).send({
          title: "ibtest2",
          description: "go awwwym",
          country: "s",
          type: "idont know",
          details: "sayesssm",
          duration: "2days",
          from_date: "1995-05-03T21:00:00.000Z",
          to_date: "1995-03-05T22:00:00.000Z",
          working_hours: "54days",
          working_days: "tokyo albg3a",
          minumim_age: 52,
          address: "s",
          profile_image: null,
          host_id : 28,
        }).set(
            "Authorization",
            "bearer " +
              new Buffer.from(`${token}`, "utf8")
          )
          let serviceData = await client.query('select * from Service where host_id=$1', [userData.rows[0].id])
          // console.log('service',serviceData.rows[0]);
          
        const response = await request.delete(`/host/${userData.rows[0].id}/service/${serviceData.rows[0].id}`).set(
          "Authorization",
          "bearer " +
            new Buffer.from(`${token}`, "utf8")
        )
         expect(1).toBe(1);
         expect(response.status).toBe(302)
      }); 
      it('should find user data when login on GET /volunteer/:id/host/:id', async () => {
        const resSignupHost = await request.post("/hosts/sign_up").send({
            username:"ib000",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"a1000",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignInHost = await request.post('/sign_in').send({
          username:"ib000",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`ib000:0000`, "utf8").toString(
            "base64"
          ));
          let usernameHost = await client.query('select * from host where user_name=$1', [resSignInHost.body.username]);
    
          const resSignupVolunteer = await request.post("/volunteers/sign_up").send({
            username:"30",
            password:"0000",
            first_name:"samer00",
            last_name:"alnajjar00",
            email:"30",
            country:"s",
            address:"s",
            birth_date:"12-12-2021",
            category:"farming"        
        });
        const resSignInVolunteer = await request.post('/sign_in').send({
          username:"30",
            password:"0000",
        }).set( "Authorization",
        "basic " +
          new Buffer.from(`30:0000`, "utf8").toString(
            "base64"
          ));
         let username = await client.query('select * from volunteer where user_name=$1', [resSignInVolunteer.body.username])
        let HostToken = resSignInHost.body.token
        
        const response = await request.get(`/volunteer/${username.rows[0].id}/host/${usernameHost.rows[0]}`).set(
          "Authorization",
          "bearer " +
            new Buffer.from(`${HostToken}`, "utf8")
        )
         expect(1).toBe(1);
         expect(response.status).toBe(200)
      });

  afterAll(async () => {
    await client.end();
  });
});