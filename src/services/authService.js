const crypto = require('crypto');
const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwtUtils');
const { PROFILE_AVATAR_IDS } = require('../constants');
const EMAIL_PATTERN = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;

const OPTIONAL_PROFILE_FIELDS = [
  'alternatePhone',
  'bloodGroup',
  'dateOfBirth',
  'residentialAddress',
  'city',
  'state',
  'emergencyContactName',
  'emergencyContactRelationship',
  'emergencyContactNumber',
  'department',
  'designation',
  'shift',
  'joiningDate',
  'workLocation',
  'supervisor',
  'employmentType',
  'employeeStatus'
];

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData
   * @returns {Object} User details and JWT token
   */
  async registerUser(userData) {
    const { name, email, password, role, phone, factoryName, employeeId, avatarId } = userData;
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      throw new ApiError(400, 'Please provide name, email and password');
    }
    if (email !== email.trim() || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      throw new ApiError(400, 'Please provide a valid email address');
    }
    const optionalProfileData = OPTIONAL_PROFILE_FIELDS.reduce((fields, field) => {
      if (Object.prototype.hasOwnProperty.call(userData, field)) {
        const value = userData[field];
        fields[field] = value === '' || value === null ? undefined : value;
      }
      return fields;
    }, {});

    if (avatarId != null && !PROFILE_AVATAR_IDS.includes(avatarId)) {
      throw new ApiError(400, 'Please choose a valid profile avatar');
    }

    // Check if user already exists
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Create user
    let user;
    try {
      user = await User.create({
        name,
        email: normalizedEmail,
        password,
        role,
        phone,
        factoryName,
        employeeId,
        avatarId: avatarId ?? null,
        ...optionalProfileData
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ApiError(409, 'User with this email already exists');
      }
      throw error;
    }

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
  async loginUser(email, password, expectedRole) {
    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }

    // Find user by email with password included
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
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

    if (expectedRole && expectedRole !== user.role) {
      throw new ApiError(403, 'The account role does not match the selected workspace');
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

  /**
 * Update logged-in user profile
 * @param {string} userId
 * @param {Object} updateData
 */
async updateUserProfile(userId, updateData) {

  if (Object.prototype.hasOwnProperty.call(updateData, 'avatarId') &&
      updateData.avatarId != null &&
      !PROFILE_AVATAR_IDS.includes(updateData.avatarId)) {
    throw new ApiError(400, 'Please choose a valid profile avatar');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }


  // Allowed fields only
  if (updateData.name) {
    user.name = updateData.name;
  }

  if (updateData.phone) {
    user.phone = updateData.phone;
  }

  if (updateData.factoryName) {
  user.factoryName = updateData.factoryName;
}

  if (updateData.employeeId) {
    user.employeeId = updateData.employeeId;
  }

  if (Object.prototype.hasOwnProperty.call(updateData, 'avatarId')) {
    user.avatarId = updateData.avatarId ?? null;
  }

  OPTIONAL_PROFILE_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updateData, field)) {
      const value = updateData[field];
      user[field] = value === '' || value === null ? undefined : value;
    }
  });


  await user.save();


  // remove password before returning
  const userObj = user.toObject();
  delete userObj.password;


  return userObj;
}
}

module.exports = new AuthService();
