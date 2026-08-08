const express = require('express');
const {
  createWorker,
  getAllWorkers,
  getWorkerById,
  getMyWorkerProfile,
  updateWorker,
  deleteWorker,
  uploadProfileImage
} = require('../controllers/workerController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadSingleImage } = require('../middlewares/uploadMiddleware');
const { ROLES } = require('../constants');

const router = express.Router();

// Apply protect middleware to all worker endpoints
router.use(protect);

router.get('/me', getMyWorkerProfile);

/**
 * @route   POST /api/v1/workers
 * @desc    Create a new worker profile
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
router.post(
  '/',
  authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  createWorker
);

/**
 * @route   GET /api/v1/workers
 * @desc    Get list of all worker profiles (with search & pagination)
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/', getAllWorkers);

/**
 * @route   GET /api/v1/workers/:id
 * @desc    Get single worker profile details
 * @access  Private (Worker, Factory Admin, Government Officer, Super Admin)
 */
router.get('/:id', getWorkerById);

/**
 * @route   PUT /api/v1/workers/:id
 * @desc    Update worker profile details
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
// router.put(
//   '/:id',
//   authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
//   updateWorker
// );

router.put(
  '/:id',
  updateWorker
);


/**
 * @route   DELETE /api/v1/workers/:id
 * @desc    Delete worker profile
 * @access  Private (Factory Admin, Super Admin)
 */
router.delete(
  '/:id',
  authorize(ROLES.FACTORY_ADMIN, ROLES.SUPER_ADMIN),
  deleteWorker
);

/**
 * @route   POST /api/v1/workers/:id/profile-image
 * @desc    Upload profile image for worker
 * @access  Private (Factory Admin, Government Officer, Super Admin)
 */
router.post(
  '/:id/profile-image',
  authorize(ROLES.FACTORY_ADMIN, ROLES.GOVERNMENT_OFFICER, ROLES.SUPER_ADMIN),
  uploadSingleImage,
  uploadProfileImage
);

module.exports = router;
