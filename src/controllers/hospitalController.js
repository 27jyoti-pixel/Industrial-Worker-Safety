const hospitalService = require('../services/hospitalService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create Hospital Controller
 */
const createHospital = asyncHandler(async (req, res) => {
  const hospital = await hospitalService.createHospital(req.body);
  return res.status(201).json({
    success: true,
    message: 'Hospital record created successfully',
    data: hospital
  });
});

/**
 * Get All Hospitals Controller
 */
const getAllHospitals = asyncHandler(async (req, res) => {
  const result = await hospitalService.getAllHospitals(req.query);
  return res.status(200).json({
    success: true,
    message: 'Hospitals fetched successfully',
    data: result.hospitals,
    pagination: result.pagination
  });
});

/**
 * Get Nearby Hospitals Controller
 */
const getNearbyHospitals = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius } = req.query;
  const hospitals = await hospitalService.getNearbyHospitals(latitude, longitude, radius);
  return res.status(200).json({
    success: true,
    message: 'Nearby hospitals fetched successfully',
    data: hospitals
  });
});

/**
 * Get Hospital by ID Controller
 */
const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await hospitalService.getHospitalById(req.params.id);
  return res.status(200).json({
    success: true,
    message: 'Hospital details fetched successfully',
    data: hospital
  });
});

/**
 * Get Hospital Emergency Contacts Controller
 */
const getEmergencyContacts = asyncHandler(async (req, res) => {
  const contacts = await hospitalService.getEmergencyContacts(req.params.id);
  return res.status(200).json({
    success: true,
    message: 'Emergency contacts and ambulance numbers fetched successfully',
    data: contacts
  });
});

/**
 * Update Hospital Controller
 */
const updateHospital = asyncHandler(async (req, res) => {
  const hospital = await hospitalService.updateHospital(req.params.id, req.body);
  return res.status(200).json({
    success: true,
    message: 'Hospital profile updated successfully',
    data: hospital
  });
});

/**
 * Delete Hospital Controller
 */
const deleteHospital = asyncHandler(async (req, res) => {
  const result = await hospitalService.deleteHospital(req.params.id);
  return res.status(200).json({
    success: true,
    message: result.message
  });
});

module.exports = {
  createHospital,
  getAllHospitals,
  getNearbyHospitals,
  getHospitalById,
  getEmergencyContacts,
  updateHospital,
  deleteHospital
};
