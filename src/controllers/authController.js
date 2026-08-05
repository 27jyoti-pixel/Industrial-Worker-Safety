const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Register User Controller
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

/**
 * Login User Controller
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  return res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: result
  });
});

/**
 * Get Current User Profile Controller
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getUserProfile(req.user._id);
  return res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: profile
  });
});

/**
 * Forgot Password Controller
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  return res.status(200).json({
    success: true,
    message: result.message,
    data: result
  });
});

/**
 * Reset Password Controller
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const result = await authService.resetPassword(token, password);
  return res.status(200).json({
    success: true,
    message: result.message
  });
});

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword
};
