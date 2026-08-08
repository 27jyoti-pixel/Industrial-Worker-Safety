const Complaint = require('../models/complaintModel');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./cloudinaryService');
const { COMPLAINT_STATUS, ROLES } = require('../constants');

class ComplaintService {
  /**
   * Create a new safety complaint
   * @param {Object} complaintData
   * @param {string} userId - ID of user filing complaint
   */
  async createComplaint(complaintData, userId) {
    const complaint = await Complaint.create({
      ...complaintData,
      reportedBy: userId,
      status: COMPLAINT_STATUS.OPEN
    });
    return complaint;
  }

  /**
   * Get all safety complaints with filters and pagination
   * @param {Object} queryParams
   * @param {Object} user - Authenticated user
   */
  async getAllComplaints(queryParams, user) {
    const { complaintType, status, severity, factoryName, search, page = 1, limit = 10 } = queryParams;

    const filter = {};

    // Workers view complaints they reported
    if (user.role === ROLES.WORKER) {
      filter.reportedBy = user._id;
    }

    if (complaintType) {
      filter.complaintType = complaintType;
    }

    if (status) {
      filter.status = status;
    }

    if (severity) {
      filter.severity = severity;
    }

    if (factoryName) {
      filter.factoryName = { $regex: factoryName, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { complaintNumber: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const complaints = await Complaint.find(filter)
      .populate('reportedBy', 'name email role phone')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Complaint.countDocuments(filter);

    return {
      complaints,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Get single complaint by ID
   * @param {string} complaintId
   * @param {Object} user
   */
  async getComplaintById(complaintId, user) {
    const complaint = await Complaint.findById(complaintId)
      .populate('reportedBy', 'name email role phone')
      .populate('assignedTo', 'name email role');

    if (!complaint) {
      throw new ApiError(404, 'Safety complaint not found');
    }

    if (user.role === ROLES.WORKER && complaint.reportedBy._id.toString() !== user._id.toString()) {
      throw new ApiError(403, 'You are not authorized to view this complaint');
    }

    return complaint;
  }

  /**
   * Update complaint details
   * @param {string} complaintId
   * @param {Object} updateData
   * @param {Object} user
   */
  async updateComplaint(complaintId, updateData, user) {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new ApiError(404, 'Safety complaint not found');
    }


// Worker can update only his own complaint
if (complaint.reportedBy.toString() !== user._id.toString()) {
  throw new ApiError(
    403,
    'You are not authorized to update this complaint'
  );
}

// Worker can update only open complaints
if (complaint.status !== COMPLAINT_STATUS.OPEN) {
  throw new ApiError(
    400,
    'Cannot edit complaint that is already in progress or resolved'
  );
}

    Object.assign(complaint, updateData);
    await complaint.save();

    return complaint;
  }

  /**
   * Update complaint status, resolution details, and assign officer
   * Statuses: Open -> In Progress -> Resolved / Rejected
   * @param {string} complaintId
   * @param {Object} statusData { status, resolutionDetails, assignedTo }
   */
  async updateComplaintStatus(complaintId, statusData) {
    const { status, resolutionDetails, assignedTo } = statusData;

    const validStatuses = Object.values(COMPLAINT_STATUS);
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new ApiError(404, 'Safety complaint not found');
    }

    complaint.status = status;

    if (resolutionDetails) {
      complaint.resolutionDetails = resolutionDetails;
    }

    if (assignedTo) {
      complaint.assignedTo = assignedTo;
    }

    await complaint.save();

    return complaint;
  }

  /**
   * Delete complaint and clean up evidence images from Cloudinary
   * @param {string} complaintId
   * @param {Object} user
   */
  async deleteComplaint(complaintId, user) {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new ApiError(404, 'Safety complaint not found');
    }

    // Worker can delete only his own complaint
    if (complaint.reportedBy.toString() !== user._id.toString()) {
      throw new ApiError(
        403,
        'You are not authorized to delete this complaint'
      );
    }

// Worker can delete only open complaints
if (complaint.status !== COMPLAINT_STATUS.OPEN) {
  throw new ApiError(
    400,
    'Cannot delete a complaint that is in progress or resolved'
  );
}

    // Delete associated images from Cloudinary
    if (complaint.images && complaint.images.length > 0) {
      for (const img of complaint.images) {
        if (img.publicId) {
          await cloudinaryService.deleteFile(img.publicId);
        }
      }
    }

    await complaint.deleteOne();

    return { message: 'Safety complaint deleted successfully' };
  }

  /**
   * Upload evidence images for safety complaint
   * @param {string} complaintId
   * @param {Array} files - Array of Multer file objects
   */
  async uploadComplaintImages(complaintId, files,user) {
    if (!files || files.length === 0) {
      throw new ApiError(400, 'Please upload at least one image');
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new ApiError(404, 'Safety complaint not found');
    }


    // Worker can upload only on his own complaint
    if (complaint.reportedBy.toString() !== user._id.toString()) {
      throw new ApiError(
        403,
        'You are not authorized to upload evidence for this complaint'
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      console.log("FILE RECEIVED:", file);

      const uploadResult = await cloudinaryService.uploadFile(
        file.path,
        'industrial_worker_safety/complaints'
      );

      console.log("CLOUDINARY RESULT:", uploadResult);

      uploadedImages.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId
      });
    }

    complaint.images.push(...uploadedImages);
    console.log("BEFORE SAVE");
    await complaint.save();
    console.log("AFTER SAVE");
    return complaint;
  }

  async deleteComplaintImage(complaintId, imageId, user) {

  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new ApiError(404, 'Safety complaint not found');
  }


  // only owner can delete image
  if (complaint.reportedBy.toString() !== user._id.toString()) {
    throw new ApiError(
      403,
      'You are not authorized to delete this image'
    );
  }


  const image = complaint.images.id(imageId);

  if (!image) {
    throw new ApiError(
      404,
      'Evidence image not found'
    );
  }


  // delete from cloudinary
  if (image.publicId) {
    await cloudinaryService.deleteFile(image.publicId);
  }


  // remove from mongodb
  complaint.images.pull(imageId);

  await complaint.save();

  return complaint;
}
}

module.exports = new ComplaintService();
