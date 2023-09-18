const request = require('supertest');
const app = require('../app');  // Assuming your main app file is named app.js

describe('Invoices Routes', () => {
  // Test GET /invoices
  describe('GET /invoices', () => {
    it('responds with status 200', async () => {
      const response = await request(app).get('/invoices');
      expect(response.statusCode).toBe(200);
    });
  });

  // Test GET /invoices/:id
  describe('GET /invoices/:id', () => {
    it('responds with status 200 for a valid invoice id', async () => {
      // Replace '1' with a valid invoice id from your database
      const response = await request(app).get('/invoices/1');
      expect(response.statusCode).toBe(200);
    });

    it('responds with status 404 for an invalid invoice id', async () => {
      const response = await request(app).get('/invoices/9999');
      expect(response.statusCode).toBe(404);
    });
  });

  // Add more tests for other routes (POST, PUT, DELETE) if needed
});
