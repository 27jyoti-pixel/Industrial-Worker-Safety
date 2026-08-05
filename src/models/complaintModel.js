const mongoose = require('mongoose');
const { COMPLAINT_TYPE, COMPLAINT_STATUS } = require('../constants');

const complaintSchema = new mongoose.Schema(
  {
    complaintNumber: {
      type: String,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true
    },
    complaintType: {
      type: String,
      enum: {
        values: Object.values(COMPLAINT_TYPE),
        message: 'Invalid complaint type'
      },
      required: [true, 'Complaint type is required']
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true
    },
    factoryName: {
      type: String,
      required: [true, 'Factory name is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true
    },
    locationDetails: {
      type: String,
      trim: true
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ],
    status: {
      type: String,
      enum: {
        values: Object.values(COMPLAINT_STATUS),
        message: 'Invalid complaint status'
      },
      default: COMPLAINT_STATUS.OPEN
    },
    resolutionDetails: {
      type: String,
      trim: true,
      default: ''
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate unique complaint number before saving
complaintSchema.pre('save', function (next) {
  if (!this.complaintNumber) {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.complaintNumber = `CMP-${dateStr}-${randomHex}`;
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
