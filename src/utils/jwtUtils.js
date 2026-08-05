const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate JWT Token for authenticated user
 * @param {string} userId - User MongoDB ObjectId
 * @param {string} role - User Role
 * @returns {string} JWT Token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * Verify JWT Token
 * @param {string} token - JWT Token string
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  generateToken,
  verifyToken
};
