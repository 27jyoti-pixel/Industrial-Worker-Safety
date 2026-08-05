const mongoose = require('mongoose');
const { CLAIM_STATUS } = require('../constants');

const claimSchema = new mongoose.Schema(
  {
    claimNumber: {
      type: String,
      unique: true,
      trim: true
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker'
    },
    accidentReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accident'
    },
    claimAmount: {
      type: Number,
      required: [true, 'Claim amount is required'],
      min: [0, 'Claim amount cannot be negative']
    },
    approvedAmount: {
      type: Number,
      default: 0,
      min: [0, 'Approved amount cannot be negative']
    },
    medicalExpenses: {
      type: Number,
      default: 0
    },
    disabilityType: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Claim description is required'],
      trim: true
    },
    documents: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        name: { type: String, default: 'Document' }
      }
    ],
    status: {
      type: String,
      enum: {
        values: Object.values(CLAIM_STATUS),
        message: 'Invalid claim status'
      },
      default: CLAIM_STATUS.SUBMITTED
    },
    remarks: {
      type: String,
      trim: true,
      default: ''
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate claim number before saving
claimSchema.pre('save', function (next) {
  if (!this.claimNumber) {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.claimNumber = `CLM-${dateStr}-${randomHex}`;
  }
  next();
});

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;
