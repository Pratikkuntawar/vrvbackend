const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

const router = express.Router();

//Register Route
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      // Check if all required fields are present
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Invalid credentials. All fields are required.' });
      }
  
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: `User is already registered with the name: ${existingUser.name}` });
      }
  
      // If not, create a new user
      const user = new User({ name, email, password, role });
      await user.save();
      res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Login Route 
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password!' });
    }
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials!' });
      }
  
      // Create a JWT token with user ID and role
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } // Token expires in 1 hour
      );
  
      // Respond with the token and user information (optional)
      res.status(200).json({
        message: 'Login successful!',
        token,
        user: { id: user._id, name: user.name, role: user.role },
      });
    } catch (err) {
      console.error(err.message); // Log error for debugging
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
   


router.post('/logout', async (req, res) => {
  // Extract token from Authorization header
  const token = req.header('Authorization');
  
  // Check if token is missing
  if (!token) {
    return res.status(400).json({ message: 'No token provided. You need to log in first.' });
  }

  const jwtToken = token.split(' ')[1]; // Extract token from the "Bearer <token>" format

  try {
    // Verify the JWT token. If invalid or expired, it will throw an error
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET); // Use your JWT_SECRET key

    // Check if token is valid by verifying that decoded data exists
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token. Please log in again.' });
    }

    // Add the token to the blacklist to invalidate it
    await TokenBlacklist.create({
      token: jwtToken,
      expiresAt: new Date(decoded.exp * 1000), // Use the token's expiration time
    });

    // Respond with a success message
    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (err) {
    // Handle errors like token expiration or invalid token
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token expired. Please log in again.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token. Please log in again.' });
    }
    // Handle any other errors
    res.status(500).json({ error: 'Failed to log out. Please try again later.' });
  }
});

module.exports = router;
