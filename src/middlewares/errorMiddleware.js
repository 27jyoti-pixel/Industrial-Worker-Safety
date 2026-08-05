const ApiError = require('../utils/ApiError');
const config = require('../config/env');

/**
 * Centralized Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError instances into standard ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(config.env === 'development' && { stack: error.stack })
  };

  if (config.env === 'development') {
    console.error(`[Error Middleware] Path: ${req.originalUrl} | Message: ${error.message}`);
  }

  return res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;
