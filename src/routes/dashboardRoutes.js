const express = require('express');
const {
  getWorkerDashboard,
  getAdminDashboard,
  getSystemStats
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// Protect all dashboard routes
router.use(protect);

/**
 * @route   GET /api/v1/dashboard/worker
 * @desc    Get dashboard metrics for logged-in Worker
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/worker', getWorkerDashboard);

/**
 * @route   GET /api/v1/dashboard/admin
 * @desc    Get dashboard metrics and analytics for Admins & Govt Officers
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
router.get(
  '/admin',
  authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  getAdminDashboard
);

/**
 * @route   GET /api/v1/dashboard/stats
 * @desc    Get high-level platform statistics
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/stats', getSystemStats);

module.exports = router;
