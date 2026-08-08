const express = require('express');
const {
register,
login,
getProfile,
updateProfile,
forgotPassword,
resetPassword
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user (Worker, Factory Admin, Government Officer, Super Admin)
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /api/v1/auth/login
 * @desc Authenticate user & return JWT token
 * @access Public
 */
router.post('/login', login);

/**
 * @route GET /api/v1/auth/me
 * @desc Get currently authenticated user profile
 * @access Private (Protected)
 */
router.get('/me', protect, getProfile);

/**
 * @route PUT /api/v1/auth/profile
 * @desc Update logged-in user profile
 * @access Private
 */
router.put('/profile', protect, updateProfile);

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Request password reset token
 * @access Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route PATCH /api/v1/auth/reset-password/:token
 * @desc Reset password using token
 * @access Public
 */
router.patch('/reset-password/:token', resetPassword);

module.exports = router;
