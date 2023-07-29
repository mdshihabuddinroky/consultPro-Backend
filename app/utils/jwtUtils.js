// utils/jwtUtils.js

const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key'; // Replace with your secret key

function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1d' }); // Token expires in 1 day
}

function verifyToken(token) {
  return jwt.verify(token, secretKey);
}

module.exports = { generateToken, verifyToken };
