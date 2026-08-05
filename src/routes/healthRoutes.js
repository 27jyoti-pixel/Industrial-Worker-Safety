const express = require('express');
const { getHealthStatus } = require('../controllers/healthController');

const router = express.Router();

/**
 * @route GET /api/v1/health
 * @desc Get backend system health status
 * @access Public
 */
router.get('/', getHealthStatus);

module.exports = router;
