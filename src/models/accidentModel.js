const mongoose = require('mongoose');
const { ACCIDENT_SEVERITY } = require('../constants');

const accidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Accident title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Accident description is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Accident date is required']
    },
    time: {
      type: String,
      required: [true, 'Accident time is required'],
      trim: true
    },
    factory: {
      type: String,
      required: [true, 'Factory name is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    severity: {
      type: String,
      enum: {
        values: Object.values(ACCIDENT_SEVERITY),
        message: 'Invalid severity level'
      },
      required: [true, 'Severity level is required']
    },
    images: [
  {
    url: {
      type: String,
      required: true
    },

    publicId: {
      type: String,
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    uploadedByRole: {
      type: String
    },

    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }
],
    status: {
      type: String,
      enum: ['Reported', 'Under Investigation', 'Resolved', 'Closed'],
      default: 'Reported'
    },
    witnessDetails: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      statement: { type: String, trim: true }
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker'
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportSource: {
    type: String,
    enum: [
      "Worker Report",
      "Factory Inspection",
      "Government Inspection"
    ],
    default: "Worker Report"
  },
  },
  {
    timestamps: true
  }
);

const Accident = mongoose.model('Accident', accidentSchema);

module.exports = Accident;
