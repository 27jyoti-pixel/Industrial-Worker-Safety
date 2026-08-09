const express = require('express');
const {
  createHospital,
  getAllHospitals,
  getNearbyHospitals,
  getHospitalById,
  getEmergencyContacts,
  updateHospital,
  getHospitalDetails,
  deleteHospital
} = require('../controllers/hospitalController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// Protect all hospital routes
router.use(protect);

/**
 * @route   GET /api/v1/hospitals/nearby
 * @desc    Get nearby hospitals within radius using latitude and longitude
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/nearby', getNearbyHospitals);

/**
 * @route   GET /api/v1/hospitals/:id/emergency-contacts
 * @desc    Get hospital emergency contact numbers and ambulance hotlines
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/:id/emergency-contacts', getEmergencyContacts);

router.get('/:id/details', getHospitalDetails);

/**
 * @route   POST /api/v1/hospitals
 * @desc    Create a new hospital record
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
router.post(
  '/',
  authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  createHospital
);

/**
 * @route   GET /api/v1/hospitals
 * @desc    Get all hospital listings
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/', getAllHospitals);

/**
 * @route   GET /api/v1/hospitals/:id
 * @desc    Get single hospital details
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/:id', getHospitalById);

/**
 * @route   PUT /api/v1/hospitals/:id
 * @desc    Update hospital details
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
router.put(
  '/:id',
  authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  updateHospital
);

/**
 * @route   DELETE /api/v1/hospitals/:id
 * @desc    Delete hospital record
 * @access  Private (Government Officer, Super Admin)
 */
router.delete(
  '/:id',
  authorize(ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  deleteHospital
);

module.exports = router;
