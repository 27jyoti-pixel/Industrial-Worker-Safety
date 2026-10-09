const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants');
const { createEmergency, getActiveEmergencies, getEmergencyHistory, acknowledgeEmergency, changeEmergencyStatus } = require('../controllers/emergencyController');

const router = express.Router();
router.use(protect);
router.get('/active', getActiveEmergencies);
router.get('/history', getEmergencyHistory);
router.post('/', createEmergency);
router.post('/:id/acknowledgements', acknowledgeEmergency);
router.patch('/:id/status', authorize(ROLES.FACTORY_ADMIN), changeEmergencyStatus);
module.exports = router;
