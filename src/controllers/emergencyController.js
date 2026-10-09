const EmergencyIncident = require('../models/emergencyIncidentModel');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { emitFactoryEvent } = require('../sockets/emergencySocket');

const TYPES = ['Fire or explosion', 'Gas leakage', 'Chemical spill', 'Electrical hazard', 'Structural danger', 'Other critical threat'];
const createWindows = new Map();
const factoryOf = (user) => {
  const factoryName = user?.factoryName?.trim();
  if (!factoryName) throw new ApiError(403, 'Your account must have a factory association to use emergency alerts.');
  return factoryName.toLocaleLowerCase('en');
};
const publicIncident = (incident) => ({
  _id: incident._id,
  type: incident.type,
  location: incident.location,
  description: incident.description,
  status: incident.status,
  createdAt: incident.createdAt,
  resolvedAt: incident.resolvedAt,
  resolutionStatus: incident.resolutionStatus,
  acknowledgementCount: incident.acknowledgements.length
});

const createEmergency = asyncHandler(async (req, res) => {
  const factoryName = factoryOf(req.user);
  const { type, location, description = '', requestId } = req.body || {};
  if (!TYPES.includes(type)) throw new ApiError(400, 'Choose a valid emergency type.');
  if (typeof location !== 'string' || !location.trim() || location.trim().length > 160) throw new ApiError(400, 'Provide an incident location (up to 160 characters).');
  if (typeof description !== 'string' || description.length > 500) throw new ApiError(400, 'Description must be 500 characters or fewer.');
  if (typeof requestId !== 'string' || !/^[\w-]{16,80}$/.test(requestId)) throw new ApiError(400, 'A valid request ID is required.');

  let incident = await EmergencyIncident.findOne({ reportedBy: req.user._id, requestId });
  let created = false;
  if (!incident) {
  const now = Date.now();
  const userKey = req.user._id.toString();
  const window = createWindows.get(userKey);
  if (!window || now - window.startedAt >= 60_000) createWindows.set(userKey, { startedAt: now, count: 0 });
  const currentWindow = createWindows.get(userKey);
  if (currentWindow.count >= 10) throw new ApiError(429, 'Emergency alert limit reached. Follow the factory emergency procedure and contact safety staff directly.');
  currentWindow.count += 1;
  if (createWindows.size > 1000) {
    for (const [key, value] of createWindows) if (now - value.startedAt >= 60_000) createWindows.delete(key);
  }
  try {
    incident = await EmergencyIncident.create({ factoryName, reportedBy: req.user._id, requestId, type, location: location.trim(), description: description.trim(), status: 'ACTIVE' });
    created = true;
  } catch (error) {
    if (error.code !== 11000) throw error;
    incident = await EmergencyIncident.findOne({ reportedBy: req.user._id, requestId });
  }
  }

  // Only a first insert is broadcast; idempotent retries never create duplicate notifications.
  const broadcastInitiated = created ? emitFactoryEvent(factoryName, 'emergency:created', publicIncident(incident)) : false;
  return res.status(created ? 201 : 200).json(new ApiResponse(created ? 201 : 200, {
    incident: publicIncident(incident), broadcastInitiated, duplicate: !created
  }, created ? (broadcastInitiated ? 'Emergency persisted and factory broadcast initiated.' : 'Emergency persisted, but real-time broadcast is currently unavailable.') : 'This emergency request was already processed.'));
});

const getActiveEmergencies = asyncHandler(async (req, res) => {
  const incidents = await EmergencyIncident.find({ factoryName: factoryOf(req.user), status: 'ACTIVE' }).sort({ createdAt: -1 });
  const results = incidents.map((incident) => ({
    ...publicIncident(incident),
    acknowledgedByMe: incident.acknowledgements.some(({ user }) => user.toString() === req.user._id.toString())
  }));
  return res.status(200).json(new ApiResponse(200, { incidents: results }, 'Active emergencies retrieved.'));
});

const getEmergencyHistory = asyncHandler(async (req, res) => {
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;
  const incidents = await EmergencyIncident.find({ factoryName: factoryOf(req.user) }).sort({ createdAt: -1 }).limit(limit);
  return res.status(200).json(new ApiResponse(200, { incidents: incidents.map(publicIncident) }, 'Emergency history retrieved.'));
});

const acknowledgeEmergency = asyncHandler(async (req, res) => {
  const factoryName = factoryOf(req.user);
  const updated = await EmergencyIncident.findOneAndUpdate(
    { _id: req.params.id, factoryName, status: 'ACTIVE', 'acknowledgements.user': { $ne: req.user._id } },
    { $push: { acknowledgements: { user: req.user._id, acknowledgedAt: new Date() } } },
    { new: true }
  );
  if (!updated) {
    const existing = await EmergencyIncident.findOne({ _id: req.params.id, factoryName, status: 'ACTIVE' });
    if (!existing) throw new ApiError(404, 'Active emergency not found.');
    return res.status(200).json(new ApiResponse(200, { acknowledged: true, duplicate: true }, 'Already acknowledged.'));
  }
  emitFactoryEvent(factoryName, 'emergency:updated', publicIncident(updated));
  return res.status(200).json(new ApiResponse(200, { acknowledged: true, duplicate: false }, 'Acknowledgement recorded.'));
});

const changeEmergencyStatus = asyncHandler(async (req, res) => {
  const factoryName = factoryOf(req.user);
  const status = req.body?.status;
  if (!['RESOLVED', 'CANCELLED'].includes(status)) throw new ApiError(400, 'Status must be RESOLVED or CANCELLED.');
  const incident = await EmergencyIncident.findOneAndUpdate(
    { _id: req.params.id, factoryName, status: 'ACTIVE' },
    { $set: { status, resolutionStatus: status, resolvedBy: req.user._id, resolvedAt: new Date() } },
    { new: true }
  );
  if (!incident) throw new ApiError(404, 'Active emergency not found.');
  emitFactoryEvent(factoryName, 'emergency:updated', publicIncident(incident));
  return res.status(200).json(new ApiResponse(200, { incident: publicIncident(incident) }, `Emergency ${status.toLowerCase()}.`));
});

module.exports = { createEmergency, getActiveEmergencies, getEmergencyHistory, acknowledgeEmergency, changeEmergencyStatus, factoryOf, publicIncident };
