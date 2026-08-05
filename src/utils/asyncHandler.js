/**
 * Higher-Order Function to handle asynchronous route handlers without boilerplate try-catch
 * @param {Function} requestHandler - Controller / Handler function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
