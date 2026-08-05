const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, trim: true }
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    phone: {
      type: String,
      required: [true, 'Primary phone number is required'],
      trim: true
    },
    emergencyContacts: [
      {
        name: { type: String, trim: true },
        phone: { type: String, trim: true },
        designation: { type: String, trim: true }
      }
    ],
    ambulanceNumbers: [
      {
        type: String,
        trim: true
      }
    ],
    facilities: [
      {
        type: String,
        trim: true
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Create 2dsphere index for geospatial location queries
hospitalSchema.index({ location: '2dsphere' });

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
