const complaintService = require('../services/complaintService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create Safety Complaint Controller
 */
const createComplaint = asyncHandler(async (req, res) => {
  const complaint = await complaintService.createComplaint(req.body, req.user._id);
  return res.status(201).json({
    success: true,
    message: 'Safety complaint filed successfully',
    data: complaint
  });
});

/**
 * Get All Complaints Controller
 */
const getAllComplaints = asyncHandler(async (req, res) => {
  const result = await complaintService.getAllComplaints(req.query, req.user);
  return res.status(200).json({
    success: true,
    message: 'Safety complaints fetched successfully',
    data: result.complaints,
    pagination: result.pagination
  });
});

/**
 * Get Complaint by ID Controller
 */
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await complaintService.getComplaintById(req.params.id, req.user);
  return res.status(200).json({
    success: true,
    message: 'Safety complaint details fetched successfully',
    data: complaint
  });
});

/**
 * Update Complaint Controller
 */
const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await complaintService.updateComplaint(req.params.id, req.body, req.user);
  return res.status(200).json({
    success: true,
    message: 'Safety complaint details updated successfully',
    data: complaint
  });
});

/**
 * Update Complaint Status Controller
 */
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const complaint = await complaintService.updateComplaintStatus(req.params.id, req.body);
  return res.status(200).json({
    success: true,
    message: `Safety complaint status updated to '${complaint.status}' successfully`,
    data: complaint
  });
});

/**
 * Delete Complaint Controller
 */
const deleteComplaint = asyncHandler(async (req, res) => {
  const result = await complaintService.deleteComplaint(req.params.id, req.user);
  return res.status(200).json({
    success: true,
    message: result.message
  });
});

/**
 * Upload Complaint Evidence Images Controller
 */
const uploadComplaintImages = asyncHandler(async (req, res) => {
  const complaint = await complaintService.uploadComplaintImages(req.params.id, req.files);
  return res.status(200).json({
    success: true,
    message: 'Complaint evidence images uploaded successfully',
    data: complaint
  });
});

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
  uploadComplaintImages
};
