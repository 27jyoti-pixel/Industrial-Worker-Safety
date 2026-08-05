const claimService = require('../services/claimService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Submit Compensation Claim Controller
 */
const submitClaim = asyncHandler(async (req, res) => {
  const claim = await claimService.submitClaim(req.body, req.user._id);
  return res.status(201).json({
    success: true,
    message: 'Compensation claim submitted successfully',
    data: claim
  });
});


/**
 * Track/Get All Claims Controller
 */

const getAllClaims = asyncHandler(async (req, res) => {
  const result = await claimService.getAllClaims(req.query, req.user);

  return res.status(200).json({
    success: true,
    message: "Compensation claims fetched successfully",
    data: result.claims,
    pagination: result.pagination
  });
});

/**
 * Get Claim Details by ID Controller
 */
const getClaimById = asyncHandler(async (req, res) => {
  const claim = await claimService.getClaimById(req.params.id, req.user);
  return res.status(200).json({
    success: true,
    message: 'Compensation claim details fetched successfully',
    data: claim
  });
});

/**
 * Update Claim Controller
 */

const updateClaim = asyncHandler(async (req, res) => {
  const claim = await claimService.updateClaim(req.params.id, req.body, req.user);

  return res.status(200).json({
    success: true,
    message: 'Compensation claim updated successfully',
    data: claim
  });
});
/**
 * Update Claim Status & Admin Approval Controller
 */

const updateClaimStatus = asyncHandler(async (req, res) => {
    const claim = await claimService.updateClaimStatus(
        req.params.id,
        req.body,
        req.user
    );

    return res.status(200).json({
        success: true,
        message: `Claim status updated to '${claim.status}' successfully`,
        data: claim
    });
});

/**
 * Delete Claim Controller
 */
const deleteClaim = asyncHandler(async (req, res) => {
  const result = await claimService.deleteClaim(req.params.id, req.user);
  return res.status(200).json({
    success: true,
    message: result.message
  });
});

/**
 * Upload Claim Documents Controller
 */
const uploadClaimDocuments = asyncHandler(async (req, res) => {
  const claim = await claimService.uploadClaimDocuments(req.params.id, req.files);
  return res.status(200).json({
    success: true,
    message: 'Supporting documents uploaded successfully',
    data: claim
  });
});

module.exports = {
  submitClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  updateClaimStatus,
  deleteClaim,
  uploadClaimDocuments
};
