const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get Worker Dashboard Controller
 */
const getWorkerDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await dashboardService.getWorkerDashboard(req.user);
  return res.status(200).json({
    success: true,
    message: 'Worker dashboard data fetched successfully',
    data: dashboardData
  });
});

/**
 * Get Admin Dashboard Controller
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await dashboardService.getAdminDashboard();
  return res.status(200).json({
    success: true,
    message: 'Admin dashboard metrics fetched successfully',
    data: dashboardData
  });
});

/**
 * Get System Stats Controller
 */
const getSystemStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getSystemStats();
  return res.status(200).json({
    success: true,
    message: 'System statistics fetched successfully',
    data: stats
  });
});

module.exports = {
  getWorkerDashboard,
  getAdminDashboard,
  getSystemStats
};
