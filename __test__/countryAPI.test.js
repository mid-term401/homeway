'use strict';
require('dotenv').config();
const {server} = require('../src/server');
const superTest = require('supertest');
const request = superTest(server);


describe('Server', () => {
    it('')
    it('handle invalid routes', async () => {
        const response = await request.get('/random');
        expect(response.status).toEqual(404);
      });
      it('handle server errors', async () => {
        const response = await request.get('/error');
        expect(response.status).toEqual(500);
      });      
})