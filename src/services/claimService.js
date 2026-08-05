const Claim = require('../models/claimModel');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./cloudinaryService');
const { CLAIM_STATUS, ROLES } = require('../constants');

class ClaimService {
  /**
   * Submit a new compensation claim
   * @param {Object} claimData
   * @param {string} userId - ID of user submitting claim
   */
  async submitClaim(claimData, userId) {
    const claim = await Claim.create({
      ...claimData,
      submittedBy: userId,
      status: CLAIM_STATUS.SUBMITTED
    });
    return claim;
  }

  /**
   * Track/List compensation claims with filters and pagination
   * @param {Object} queryParams
   * @param {Object} user - Authenticated user
   */
  async getAllClaims(queryParams, user) {
    const { status, claimNumber, search, page = 1, limit = 10 } = queryParams;

    const filter = {};

    // Workers only view claims they submitted
    if (user.role === ROLES.WORKER) {
      filter.submittedBy = user._id;
    }

    if (status) {
      filter.status = status;
    }

    if (claimNumber) {
      filter.claimNumber = { $regex: claimNumber, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { claimNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { disabilityType: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const claims = await Claim.find(filter)
      .populate('submittedBy', 'name email role phone')
      .populate('worker', 'name employeeId factoryName bloodGroup')
      .populate('accidentReport', 'title date severity factory')
      .populate('reviewedBy', 'name email role')
      .populate('approvedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Claim.countDocuments(filter);

    return {
      claims,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Track specific claim details by ID
   * @param {string} claimId
   * @param {Object} user
   */
  async getClaimById(claimId, user) {
    const claim = await Claim.findById(claimId)
      .populate('submittedBy', 'name email role phone')
      .populate('worker')
      .populate('accidentReport')
      .populate('reviewedBy', 'name email role')
      .populate('approvedBy', 'name email role');

    if (!claim) {
      throw new ApiError(404, 'Compensation claim not found');
    }

    if (user.role === ROLES.WORKER && claim.submittedBy._id.toString() !== user._id.toString()) {
      throw new ApiError(403, 'You are not authorized to view this claim');
    }

    return claim;
  }

  /**
   * Update claim details (before review/approval)
   * @param {string} claimId
   * @param {Object} updateData
   * @param {Object} user
   */
  async updateClaim(claimId, updateData, user) {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new ApiError(404, 'Compensation claim not found');
    }

    if (user.role === ROLES.WORKER) {
      if (claim.submittedBy.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to update this claim');
      }
      if (claim.status !== CLAIM_STATUS.SUBMITTED) {
        throw new ApiError(400, 'Cannot update a claim that is already under review or processed');
      }
    }

    Object.assign(claim, updateData);
    await claim.save();

    return claim;
  }

  /**
   * Update claim status and approval details (Admin / Government Officer workflow)
   * Statuses: Submitted -> Under Review -> Approved / Rejected -> Completed
   * @param {string} claimId
   * @param {Object} statusData { status, approvedAmount, remarks }
   * @param {Object} reviewerUser - Authenticated admin/officer
   */
  async updateClaimStatus(claimId, statusData, reviewerUser) {
    console.log("PATCH SERVICE HIT");
    console.log(statusData);
    const { status, approvedAmount, remarks } = statusData;

    const validStatuses = Object.values(CLAIM_STATUS);


    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new ApiError(404, 'Compensation claim not found');
    }

    claim.status = status;

    if (remarks) {
      claim.remarks = remarks;
    }

    if (status === CLAIM_STATUS.UNDER_REVIEW) {
      claim.reviewedBy = reviewerUser._id;
    }

    if (status === CLAIM_STATUS.APPROVED || status === CLAIM_STATUS.COMPLETED) {
      claim.approvedBy = reviewerUser._id;
      if (approvedAmount !== undefined) {
        claim.approvedAmount = approvedAmount;
      }
    }

    if (status === CLAIM_STATUS.REJECTED) {
      claim.reviewedBy = reviewerUser._id;
    }

    await claim.save();

    return claim;
  }

  /**
   * Delete compensation claim and clear document files from Cloudinary
   * @param {string} claimId
   * @param {Object} user
   */
  async deleteClaim(claimId, user) {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new ApiError(404, 'Compensation claim not found');
    }

    if (user.role === ROLES.WORKER) {
      if (claim.submittedBy.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to delete this claim');
      }
      if (claim.status !== CLAIM_STATUS.SUBMITTED) {
        throw new ApiError(400, 'Cannot delete a claim that is under review or processed');
      }
    }

    // Clear Cloudinary documents
    if (claim.documents && claim.documents.length > 0) {
      for (const doc of claim.documents) {
        if (doc.publicId) {
          await cloudinaryService.deleteFile(doc.publicId);
        }
      }
    }

    await claim.deleteOne();

    return { message: 'Compensation claim deleted successfully' };
  }

  /**
   * Upload supporting documents for compensation claim
   * @param {string} claimId
   * @param {Array} files - Array of Multer file objects
   */
  async uploadClaimDocuments(claimId, files) {
    if (!files || files.length === 0) {
      throw new ApiError(400, 'Please upload at least one supporting document');
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new ApiError(404, 'Compensation claim not found');
    }

    const uploadedDocs = [];

    for (const file of files) {
      const uploadResult = await cloudinaryService.uploadFile(
        file.path,
        'industrial_worker_safety/compensation_claims'
      );
      uploadedDocs.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        name: file.originalname || 'Supporting Document'
      });
    }

    claim.documents.push(...uploadedDocs);
    await claim.save();

    return claim;
  }
}

module.exports = new ClaimService();
