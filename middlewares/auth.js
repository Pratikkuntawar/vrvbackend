const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

const auth = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied!' });

  const jwtToken = token.split(' ')[1];

  try {
    // Check if the token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token: jwtToken });
    if (blacklisted) return res.status(401).json({ message: 'Token is invalidated!:Register first and then logged in. if already registered then logged in first' });

    const verified = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token!' });
  }
};

module.exports = auth;
