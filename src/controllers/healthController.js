const healthService = require('../services/healthService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Health Check Controller
 */
const getHealthStatus = asyncHandler(async (req, res) => {
  const healthData = await healthService.getSystemHealth();
  return res.status(200).json({
    success: true,
    message: 'Server health retrieved successfully',
    data: healthData
  });
});

module.exports = {
  getHealthStatus
};
