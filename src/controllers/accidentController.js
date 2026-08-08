const accidentService = require('../services/accidentService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create Accident Report Controller
 */
const createReport = asyncHandler(async (req, res) => {

  const report = await accidentService.createReport(
    req.body,
    req.user._id,
    req.user.role
  );

  return res.status(201).json({
    success: true,
    message: 'Accident report created successfully',
    data: report
  });
});

/**
 * Get All Accident Reports Controller
 */


const getAllReports = asyncHandler(async (req, res) => {

  const result = await accidentService.getAllReports(req.query, req.user);

  return res.status(200).json({
    success: true,
    message: "Accident reports fetched successfully",
    data: result.reports,
    pagination: result.pagination
  });
});

/**
 * Get Accident Report by ID Controller
 */
const getReportById = asyncHandler(async (req, res) => {
  const report = await accidentService.getReportById(req.params.id);
  return res.status(200).json({
    success: true,
    message: 'Accident report details fetched successfully',
    data: report
  });
});

/**
 * Update Accident Report Controller
 */
const updateReport = asyncHandler(async (req, res) => {
  const report = await accidentService.updateReport(req.params.id, req.body, req.user);
  return res.status(200).json({
    success: true,
    message: 'Accident report updated successfully',
    data: report
  });
});

/**
 * Update Accident Report Status Controller
 */

const updateReportStatus = asyncHandler(async (req, res) => {

  const { status } = req.body;

  const report = await accidentService.updateReportStatus(req.params.id, status);

  return res.status(200).json({
    success: true,
    message: "Accident report status updated successfully",
    data: report
  });
});

/**
 * Delete Accident Report Controller
 */
const deleteReport = asyncHandler(async (req, res) => {
  const result = await accidentService.deleteReport(req.params.id, req.user);
  return res.status(200).json({
    success: true,
    message: result.message
  });
});

/**
 * Upload Accident Report Images Controller
 */
const uploadReportImages = asyncHandler(async (req, res) => {
  const report = await accidentService.uploadReportImages(req.params.id, req.files,req.user);
  return res.status(200).json({
    success: true,
    message: 'Accident report images uploaded successfully',
    data: report
  });
});

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  updateReportStatus,
  deleteReport,
  uploadReportImages
};
