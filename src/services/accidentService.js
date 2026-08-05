const Accident = require('../models/accidentModel');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./cloudinaryService');

class AccidentService {
  /**
   * Create an accident report
   * @param {Object} reportData
   * @param {string} userId - ID of user creating report
   */
  async createReport(reportData, userId) {
    const report = await Accident.create({
      ...reportData,
      reportedBy: userId
    });
    return report;
  }

  /**
   * Get all accident reports with search, filters, and pagination
   * @param {Object} queryParams
   * @param {Object} user - Authenticated user
   */
  async getAllReports(queryParams, user) {
    const { factory, severity, status, search, page = 1, limit = 10 } = queryParams;

    const filter = {};

    // If Worker, only show their reported accidents unless explicitly requested otherwise
    if (user.role === 'Worker') {
      filter.reportedBy = user._id;
    }

    if (factory) {
      filter.factory = { $regex: factory, $options: 'i' };
    }

    if (severity) {
      filter.severity = severity;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const reports = await Accident.find(filter)
      .populate('reportedBy', 'name email role')
      .populate('worker', 'name employeeId phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Accident.countDocuments(filter);

    return {
      reports,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Get accident report by ID
   * @param {string} reportId
   */
  async getReportById(reportId) {
    const report = await Accident.findById(reportId)
      .populate('reportedBy', 'name email role phone')
      .populate('worker');

    if (!report) {
      throw new ApiError(404, 'Accident report not found');
    }
    return report;
  }

  /**
   * Update accident report
   * @param {string} reportId
   * @param {Object} updateData
   * @param {Object} user - Current user
   */
  async updateReport(reportId, updateData, user) {
    const report = await Accident.findById(reportId);
    if (!report) {
      throw new ApiError(404, 'Accident report not found');
    }

    // Workers can only update their own reports if report status is 'Reported'
    if (user.role === 'Worker') {
      if (report.reportedBy.toString() !== user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to update this accident report');
      }
      if (report.status !== 'Reported') {
        throw new ApiError(400, 'Cannot update report that is already under investigation or resolved');
      }
    }

    Object.assign(report, updateData);
    await report.save();

    return report;
  }

  /**
   * Update report status
   * @param {string} reportId
   * @param {string} status
   */
  async updateReportStatus(reportId, status) {
    const validStatuses = ['Reported', 'Under Investigation', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const report = await Accident.findByIdAndUpdate(
      reportId,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      throw new ApiError(404, 'Accident report not found');
    }

    return report;
  }

  /**
   * Delete accident report and remove its images from Cloudinary
   * @param {string} reportId
   * @param {Object} user
   */
  async deleteReport(reportId, user) {
    const report = await Accident.findById(reportId);
    if (!report) {
      throw new ApiError(404, 'Accident report not found');
    }

    // Workers can only delete their own reports
    if (user.role === 'Worker' && report.reportedBy.toString() !== user._id.toString()) {
      throw new ApiError(403, 'You are not authorized to delete this accident report');
    }

    // Delete associated images from Cloudinary
    if (report.images && report.images.length > 0) {
      for (const img of report.images) {
        if (img.publicId) {
          await cloudinaryService.deleteFile(img.publicId);
        }
      }
    }

    await report.deleteOne();

    return { message: 'Accident report deleted successfully' };
  }

  /**
   * Upload multiple images for an accident report
   * @param {string} reportId
   * @param {Array} files - Array of Multer file objects
   */
  async uploadReportImages(reportId, files) {
    if (!files || files.length === 0) {
      throw new ApiError(400, 'Please upload at least one image file');
    }

    const report = await Accident.findById(reportId);
    if (!report) {
      throw new ApiError(404, 'Accident report not found');
    }

    const uploadedImages = [];

    for (const file of files) {
      const uploadResult = await cloudinaryService.uploadFile(
        file.path,
        'industrial_worker_safety/accidents'
      );
      uploadedImages.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId
      });
    }

    report.images.push(...uploadedImages);
    await report.save();

    return report;
  }
}

module.exports = new AccidentService();
