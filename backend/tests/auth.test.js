const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create test app
const app = express();
app.use(cors());
app.use(express.json());

// Mock auth routes for testing
app.post('/auth/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required!' });
  }
  res.status(201).json({ message: 'User created successfully!', userId: 1 });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required!' });
  }
  res.status(200).json({ 
    message: 'Login successful!', 
    token: 'mock-jwt-token',
    userId: 1 
  });
});

//Auth routes tests
describe('Auth Routes Tests', () => {
  test('POST /auth/signup should create user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(userData)
      .expect(201);
    
    expect(response.body.message).toBe('User created successfully!');
    expect(response.body.userId).toBe(1);
  });

  test('POST /auth/login should return token', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/auth/login')
      .send(loginData)
      .expect(200);
    
    expect(response.body.message).toBe('Login successful!');
    expect(response.body.token).toBeDefined();
  });
});