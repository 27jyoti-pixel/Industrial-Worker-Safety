const mongoose = require('mongoose');

const acknowledgementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acknowledgedAt: { type: Date, default: Date.now, required: true }
}, { _id: false });

const emergencyIncidentSchema = new mongoose.Schema({
  factoryName: { type: String, required: true, trim: true, index: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestId: { type: String, required: true },
  type: { type: String, required: true, enum: ['Fire or explosion', 'Gas leakage', 'Chemical spill', 'Electrical hazard', 'Structural danger', 'Other critical threat'] },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  status: { type: String, enum: ['ACTIVE', 'RESOLVED', 'CANCELLED'], default: 'ACTIVE', index: true },
  acknowledgements: { type: [acknowledgementSchema], default: [] },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  resolvedAt: { type: Date, default: null },
  resolutionStatus: { type: String, enum: ['RESOLVED', 'CANCELLED', null], default: null }
}, { timestamps: true });

emergencyIncidentSchema.index({ reportedBy: 1, requestId: 1 }, { unique: true });
emergencyIncidentSchema.index({ factoryName: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('EmergencyIncident', emergencyIncidentSchema);
