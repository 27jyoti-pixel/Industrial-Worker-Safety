const Claim = require('../models/claimModel');
const Worker = require('../models/workerModel');
const Accident = require('../models/accidentModel');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./cloudinaryService');
const { CLAIM_STATUS, ROLES } = require('../constants');

class ClaimService {
  /**
   * Submit a new compensation claim
   * @param {Object} claimData
   * @param {string} userId - ID of user submitting claim
   */
  async submitClaim(claimData, userId, user) {
    const normalizedClaimData = { ...claimData };

    // Empty optional ObjectId fields arrive from the form as empty strings,
    // which Mongoose cannot cast to ObjectIds.
    if (!normalizedClaimData.accidentReport) delete normalizedClaimData.accidentReport;
    if (!normalizedClaimData.worker) delete normalizedClaimData.worker;

    if (user?.role === ROLES.WORKER) {
      // Never trust a Worker ID supplied by the client.
      delete normalizedClaimData.worker;
      const worker = await Worker.findOne({ user: userId }).select('_id');
      // The worker profile link is optional in the claim schema. Ownership is
      // always recorded in submittedBy, even when no profile document exists.
      if (worker) normalizedClaimData.worker = worker._id;

      if (normalizedClaimData.accidentReport) {
        const accident = await Accident.findOne({
          _id: normalizedClaimData.accidentReport,
          reportedBy: userId
        }).select('_id');
        if (!accident) {
          throw new ApiError(403, 'You are not authorized to link this accident report');
        }
      }
    }

    const claim = await Claim.create({
      ...normalizedClaimData,
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

    console.log("Searching claim ID:", claimId);

    const claim = await Claim.findById(claimId);

    if (!claim) {
        throw new ApiError(404, 'Compensation claim not found');
    }


    if (user.role === ROLES.WORKER && claim.submittedBy.toString() !== user._id.toString()) {
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


  // Only worker can update claims
  if (user.role !== ROLES.WORKER) {
    throw new ApiError(
      403,
      'Only workers can update claims'
    );
  }


  // Worker can update only his own claim
  if (claim.submittedBy.toString() !== user._id.toString()) {
    throw new ApiError(
      403,
      'You are not authorized to update this claim'
    );
  }


  // Worker can update only before review
  if (claim.status !== CLAIM_STATUS.SUBMITTED) {
    throw new ApiError(
      400,
      'Cannot update a claim that is already under review or processed'
    );
  }


  const workerEditableFields = [
    'claimAmount',
    'medicalExpenses',
    'disabilityType',
    'description'
  ];
  for (const field of workerEditableFields) {
    if (Object.prototype.hasOwnProperty.call(updateData, field)) {
      claim[field] = updateData[field];
    }
  }

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


  // Only workers can delete claims
  if (user.role !== ROLES.WORKER) {
    throw new ApiError(
      403,
      'Only workers can delete claims'
    );
  }


  // Worker can delete only his own claim
  if (claim.submittedBy.toString() !== user._id.toString()) {
    throw new ApiError(
      403,
      'You are not authorized to delete this claim'
    );
  }


  // Worker can delete only submitted claims
  if (claim.status !== CLAIM_STATUS.SUBMITTED) {
    throw new ApiError(
      400,
      'Cannot delete a claim that is under review or processed'
    );
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

  return {
    message: 'Compensation claim deleted successfully'
  };
}

  /**
   * Upload supporting documents for compensation claim
   * @param {string} claimId
   * @param {Array} files - Array of Multer file objects
   */
  async uploadClaimDocuments(claimId, files,user) {
    if (!files || files.length === 0) {
      throw new ApiError(400, 'Please upload at least one supporting document');
    }

    const claim = await Claim.findById(claimId);
    if (!claim) {
      throw new ApiError(404, 'Compensation claim not found');
    }

    if (user.role !== ROLES.WORKER) {
  throw new ApiError(
    403,
    'Only workers can upload documents'
  );
}

if (claim.submittedBy.toString() !== user._id.toString()) {
  throw new ApiError(
    403,
    'You are not authorized to upload documents for this claim'
  );
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
