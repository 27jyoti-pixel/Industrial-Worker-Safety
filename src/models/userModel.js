const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { ROLES, PROFILE_AVATAR_IDS } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, 'Email address must be 254 characters or fewer'],
      match: [
        /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: 'Invalid user role'
      },
      default: ROLES.WORKER
    },
    phone: {
      type: String,
      validate: { validator: (value) => !value || /^\d{10}$/.test(value), message: 'Phone number must contain exactly 10 digits' }
    },
    alternatePhone: { type: String, validate: { validator: (value) => !value || /^\d{10}$/.test(value), message: 'Alternate phone number must contain exactly 10 digits' } },
    bloodGroup: { type: String, trim: true },
    dateOfBirth: { type: Date },
    residentialAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    emergencyContactName: { type: String, trim: true },
    emergencyContactRelationship: { type: String, trim: true },
    emergencyContactNumber: { type: String, validate: { validator: (value) => !value || /^\d{10}$/.test(value), message: 'Emergency contact number must contain exactly 10 digits' } },
    factoryName: {
      type: String,
      trim: true
    },
    employeeId: {
      type: String,
      trim: true
    },
    department: { type: String, trim: true },
    designation: { type: String, trim: true },
    shift: { type: String, trim: true },
    joiningDate: { type: Date },
    workLocation: { type: String, trim: true },
    supervisor: { type: String, trim: true },
    employmentType: { type: String, trim: true },
    employeeStatus: { type: String, trim: true },
    avatarId: {
      type: String,
      enum: PROFILE_AVATAR_IDS,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save hook to hash user password using bcryptjs
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare candidate password with stored hashed password
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate password reset token
 * @returns {string} Plain reset token
 */
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
