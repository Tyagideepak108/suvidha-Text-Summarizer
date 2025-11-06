const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();
const JWT_SECRET = 'suvidha_secret_key';

// /signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword
    });
    
    res.status(201).json({ 
      message: 'User created successfully!',
      userId: newUser.id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed!', error: error.message });
  }
});

// /login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password!' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful!',
      token,
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed!', error: error.message });
  }
});

// /oauth-login route for Google/GitHub
router.post('/oauth-login', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Find or create user
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Create new user with random password (OAuth users don't need password)
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await User.create({
        email,
        password: hashedPassword
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'OAuth login successful!',
      token,
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ message: 'OAuth login failed!', error: error.message });
  }
});

module.exports = router;