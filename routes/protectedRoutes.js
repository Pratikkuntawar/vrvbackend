const express = require('express');
const auth = require('../middlewares/auth');
const roleAuth = require('../middlewares/roleAuth');

const router = express.Router();

// Public route
router.get('/public', (req, res) => {
  res.status(200).json({ message: 'Public route!' });
});

// Admin-only route
router.get('/admin', auth, roleAuth(['Admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

// User route
router.get('/user', auth, roleAuth(['User']), (req, res) => {
  res.status(200).json({ message: 'Welcome User!' });
});

// Moderator route
router.get('/moderator', auth, roleAuth(['Moderator']), (req, res) => {
  res.status(200).json({ message: 'Welcome Moderator!' });
});

module.exports = router;