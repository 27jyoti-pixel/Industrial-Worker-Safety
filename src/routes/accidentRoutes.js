const express = require('express');
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  updateReportStatus,
  deleteReport,
  uploadReportImages
} = require('../controllers/accidentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMultipleImages } = require('../middlewares/uploadMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @route   POST /api/v1/accidents
 * @desc    Create a new accident report
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.post('/', createReport);

/**
 * @route   GET /api/v1/accidents
 * @desc    Get all accident reports (with filters & search)
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/', getAllReports);

/**
 * @route   GET /api/v1/accidents/:id
 * @desc    Get single accident report details
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/:id', getReportById);

/**
 * @route   PUT /api/v1/accidents/:id
 * @desc    Update accident report details
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.put('/:id', updateReport);

/**
 * @route   PATCH /api/v1/accidents/:id/status
 * @desc    Update accident report status
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
router.patch(
  '/:id/status',
  authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  updateReportStatus
);

/**
 * @route   DELETE /api/v1/accidents/:id
 * @desc    Delete accident report
 * @access  Private (Worker, Factory Admin, Super Admin)
 */
router.delete('/:id', deleteReport);

/**
 * @route   POST /api/v1/accidents/:id/images
 * @desc    Upload image evidence for accident report
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.post(
  '/:id/images',
  uploadMultipleImages,
  uploadReportImages
);

module.exports = router;
