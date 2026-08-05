const crypto = require('crypto');
const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwtUtils');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData
   * @returns {Object} User details and JWT token
   */
  async registerUser(userData) {
    const { name, email, password, role, phone, factoryName, employeeId } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      factoryName,
      employeeId
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      token
    };
  }

  /**
   * Authenticate user & generate token
   * @param {string} email
   * @param {string} password
   * @returns {Object} User details and JWT token
   */
  async loginUser(email, password) {
    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }

    // Find user by email with password included
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return {
      user: userObj,
      token
    };
  }

  /**
   * Get user profile by ID
   * @param {string} userId
   * @returns {Object} User profile
   */
  async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }
    return user;
  }

  /**
   * Initiate forgot password flow
   * @param {string} email
   * @returns {Object} Plain reset token details
   */
  async forgotPassword(email) {
    if (!email) {
      throw new ApiError(400, 'Please provide an email address');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new ApiError(404, 'No user found with that email address');
    }

    // Generate token and save to database
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    return {
      message: 'Password reset token generated successfully',
      resetToken // In production, this would be emailed to the user
    };
  }

  /**
   * Reset user password using token
   * @param {string} resetToken
   * @param {string} newPassword
   */
  async resetPassword(resetToken, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      throw new ApiError(
        400,
        'Please provide a new password with at least 6 characters'
      );
    }

    // Hash token to compare with DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new ApiError(400, 'Token is invalid or has expired');
    }

    // Set new password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return {
      message: 'Password reset successfully. You can now login with your new password.'
    };
  }
}

module.exports = new AuthService();
