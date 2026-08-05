const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Worker name is required'],
      trim: true
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true
    },
    factoryName: {
      type: String,
      required: [true, 'Factory name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood group is required']
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relation: { type: String, trim: true },
      phone: { type: String, trim: true }
    },
    insuranceDetails: {
      provider: { type: String, trim: true },
      policyNumber: { type: String, trim: true },
      validTill: { type: Date }
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true }
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    profileImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
