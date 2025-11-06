const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create test app (simplified version of main app)
const app = express();
app.use(cors());
app.use(express.json());

// Add health route for testing
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running!' });
});

//Health route test
describe('Health Route Tests', () => {
  test('GET /health should return status 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('Backend is running!');
  });

  test('GET /health should return JSON content type', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/);
    
    expect(response.status).toBe(200);
  });
});