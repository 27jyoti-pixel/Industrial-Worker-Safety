const express = require('express');
const {
  submitClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  updateClaimStatus,
  deleteClaim,
  uploadClaimDocuments
} = require('../controllers/claimController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMultipleImages } = require('../middlewares/uploadMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @route   POST /api/v1/claims
 * @desc    Submit a new compensation claim
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.post('/', submitClaim);

/**
 * @route   GET /api/v1/claims
 * @desc    Track / list compensation claims
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/', getAllClaims);

/**
 * @route   GET /api/v1/claims/:id
 * @desc    Track specific compensation claim by ID
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/:id', getClaimById);

/**
 * @route   PUT /api/v1/claims/:id
 * @desc    Update claim details (before approval)
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.put('/:id', updateClaim);

/**
 * @route   PATCH /api/v1/claims/:id/status
 * @desc    Update claim status and approval (Admin / Govt Officer approval flow)
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
router.patch(
  '/:id/status',
  authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  updateClaimStatus
);

/**
 * @route   DELETE /api/v1/claims/:id
 * @desc    Delete compensation claim
 * @access  Private (Worker, Factory Admin, Super Admin)
 */
router.delete('/:id', deleteClaim);

/**
 * @route   POST /api/v1/claims/:id/documents
 * @desc    Upload supporting evidence documents/images for claim
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.post(
  '/:id/documents',
  uploadMultipleImages,
  uploadClaimDocuments
);

module.exports = router;
