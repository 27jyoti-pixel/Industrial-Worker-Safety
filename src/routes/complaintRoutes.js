const express = require('express');
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
  uploadComplaintImages
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMultipleImages } = require('../middlewares/uploadMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @route   POST /api/v1/complaints
 * @desc    File a new safety complaint (Gas Leak, Electrical, Machinery, etc.)
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.post('/', createComplaint);

/**
 * @route   GET /api/v1/complaints
 * @desc    Get safety complaints (with filters & search)
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/', getAllComplaints);

/**
 * @route   GET /api/v1/complaints/:id
 * @desc    Get single safety complaint details
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/:id', getComplaintById);

/**
 * @route   PUT /api/v1/complaints/:id
 * @desc    Update safety complaint details
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.put('/:id', updateComplaint);

/**
 * @route   PATCH /api/v1/complaints/:id/status
 * @desc    Update complaint status, resolution details, or assign officer
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
router.patch(
  '/:id/status',
  authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  updateComplaintStatus
);

/**
 * @route   DELETE /api/v1/complaints/:id
 * @desc    Delete safety complaint
 * @access  Private (Worker, Factory Admin, Super Admin)
 */
router.delete('/:id', deleteComplaint);

/**
 * @route   POST /api/v1/complaints/:id/images
 * @desc    Upload evidence photo attachments for safety complaint
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.post(
  '/:id/images',
  uploadMultipleImages,
  uploadComplaintImages
);

module.exports = router;
