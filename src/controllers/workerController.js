const workerService = require('../services/workerService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create Worker Controller
 */
const createWorker = asyncHandler(async (req, res) => {
  const worker = await workerService.createWorker(req.body, req.user._id);
  return res.status(201).json({
    success: true,
    message: 'Worker profile created successfully',
    data: worker
  });
});

/**
 * Get All Workers Controller
 */


const getAllWorkers = asyncHandler(async (req, res) => {

  const result = await workerService.getAllWorkers(req.query);

  return res.status(200).json({
    success: true,
    message: "Workers fetched successfully",
    data: result.workers,
    pagination: result.pagination
  });
});

/**
 * Get Worker by ID Controller
 */
const getWorkerById = asyncHandler(async (req, res) => {
  const worker = await workerService.getWorkerById(req.params.id);
  return res.status(200).json({
    success: true,
    message: 'Worker profile fetched successfully',
    data: worker
  });
});

const getMyWorkerProfile = asyncHandler(async (req, res) => {
  const worker = await workerService.getMyWorkerProfile(req.user._id);

  return res.status(200).json({
    success: true,
    message: 'Worker profile fetched successfully',
    data: worker
  });
});

/**
 * Update Worker Controller
 */
const updateWorker = asyncHandler(async (req, res) => {
  const worker = await workerService.updateWorker(
  req.params.id,
  req.body,
  req.user
);
  return res.status(200).json({
    success: true,
    message: 'Worker profile updated successfully',
    data: worker
  });
});

/**
 * Delete Worker Controller
 */


const deleteWorker = asyncHandler(async (req, res) => {
  const result = await workerService.deleteWorker(req.params.id);

  return res.status(200).json({
    success: true,
    message: result.message
  });
});


/**
 * Upload Worker Profile Image Controller
 */
const uploadProfileImage = asyncHandler(async (req, res) => {
  const worker = await workerService.uploadProfileImage(req.params.id, req.file);
  return res.status(200).json({
    success: true,
    message: 'Worker profile image uploaded successfully',
    data: worker
  });
});

module.exports = {
  createWorker,
  getAllWorkers,
  getWorkerById,
  getMyWorkerProfile,
  updateWorker,
  deleteWorker,
  uploadProfileImage
};
