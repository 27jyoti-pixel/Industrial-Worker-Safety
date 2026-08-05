const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/jwtUtils');

/**
 * Middleware to protect routes and verify JWT tokens
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'You are not logged in. Please provide a Bearer token.');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new ApiError(401, 'The user belonging to this token no longer exists.');
    }

    if (!currentUser.isActive) {
      throw new ApiError(403, 'Your account has been deactivated.');
    }

    // Attach user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid authentication token.');
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Your token has expired. Please log in again.');
    }
    throw error;
  }
});

/**
 * Middleware to authorize user roles (Role-Based Access Control)
 * @param  {...string} roles - Permitted user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Role '${req.user ? req.user.role : 'Guest'}' is not authorized to perform this action`
        )
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
