const request = require('supertest');
const app = require('../app');  // Assuming your main app file is named app.js

describe('Companies Routes', () => {
  // Test GET /companies
  describe('GET /companies', () => {
    it('responds with status 200', async () => {
      const response = await request(app).get('/companies');
      expect(response.statusCode).toBe(200);
    });
  });

  // Test GET /companies/:code
  describe('GET /companies/:code', () => {
    it('responds with status 200 for a valid company code', async () => {
      const response = await request(app).get('/companies/apple');
      expect(response.statusCode).toBe(200);
    });

    it('responds with status 404 for an invalid company code', async () => {
      const response = await request(app).get('/companies/invalidcode');
      expect(response.statusCode).toBe(404);
    });
  });

  // Add more tests for other routes (POST, PUT, DELETE) if needed
});
