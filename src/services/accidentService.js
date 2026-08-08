const Accident = require('../models/accidentModel');
const Worker = require('../models/workerModel');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./cloudinaryService');


class AccidentService {

  /**
   * Create an accident report
   * @param {Object} reportData
   * @param {string} userId - ID of user creating report
   */
  
  async createReport(reportData, userId, userRole) {

  let workerId = null;
  let reportSource = "Worker Report";


  if (userRole === "Worker") {

    const worker = await Worker.findOne({
      user: userId
    });

    if (!worker) {
      throw new ApiError(
        404,
        'Worker profile not found for this user'
      );
    }

    workerId = worker._id;
    reportSource = "Worker Report";
  }


  if (userRole === "Factory Admin") {

    reportSource = "Factory Inspection";

  }


  const report = await Accident.create({

    ...reportData,

    reportedBy: userId,

    worker: workerId,

    reportSource

  });


  return report;
}

  /**
   * Get all accident reports
   */
  async getAllReports(queryParams, user) {

    const {
      factory,
      severity,
      status,
      search,
      page = 1,
      limit = 10
    } = queryParams;

    const filter = {};

    if (user.role === 'Worker') {
      filter.reportedBy = user._id;
    }

    if (factory) {
      filter.factory = {
        $regex: factory,
        $options: 'i'
      };
    }

    if (severity) {
      filter.severity = severity;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: search,
            $options: 'i'
          }
        },
        {
          department: {
            $regex: search,
            $options: 'i'
          }
        }
      ];
    }


    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const skip = (pageNum - 1) * limitNum;


    const reports = await Accident.find(filter)
      .populate('reportedBy', 'name email role')
      .populate('worker', 'name employeeId phone')
      .sort({
        createdAt: -1
      })
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
   */
  async getReportById(reportId) {

    const report = await Accident.findById(reportId)
      .populate('reportedBy', 'name email role phone')
      .populate('worker')
      .populate('images.uploadedBy', 'name email role');

    if (!report) {
      throw new ApiError(
        404,
        'Accident report not found'
      );
    }
    return report;
  }



  /**
   * Update accident report
   */
  async updateReport(reportId, updateData, user) {
    const report = await Accident.findById(reportId);

    if (!report) {
      throw new ApiError(
        404,
        'Accident report not found'
      );
    }

    if (user.role === 'Worker') {
      if (
        report.reportedBy.toString() !== user._id.toString()
      ) {
        throw new ApiError(
          403,
          'You are not authorized to update this accident report'
        );
      }


      if (report.status !== 'Reported') {
        throw new ApiError(
          400,
          'Cannot update report that is already under investigation or resolved'
        );
      }
    }

    Object.assign(report, updateData);
    await report.save();
    return report;
  }

  /**
   * Update report status
   */
  async updateReportStatus(reportId, status) {
    const validStatuses = [
      'Reported',
      'Under Investigation',
      'Resolved',
      'Closed'
    ];


    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      );
    }

    const report = await Accident.findByIdAndUpdate(
      reportId,
      {
        status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!report) {
      throw new ApiError(
        404,
        'Accident report not found'
      );
    }
    return report;
  }



  /**
   * Delete accident report
   */
  async deleteReport(reportId, user) {

    const report = await Accident.findById(reportId);

    if (!report) {
      throw new ApiError(
        404,
        'Accident report not found'
      );
    }

    if (
      user.role === 'Worker' &&
      report.reportedBy.toString() !== user._id.toString()
    ) {
      throw new ApiError(
        403,
        'You are not authorized to delete this accident report'
      );
    }

    if (report.images && report.images.length > 0) {
      for (const img of report.images) {
        if (img.publicId) {
          await cloudinaryService.deleteFile(
            img.publicId
          );
        }

      }
    }
    await report.deleteOne();
    return {
      message: 'Accident report deleted successfully'
    };
  }




  /**
   * Upload multiple images
   */
  async uploadReportImages(reportId, files,user) {
    if (!files || files.length === 0) {
      throw new ApiError(
        400,
        'Please upload at least one image file'
      );
    }

    const report = await Accident.findById(reportId);

    if (!report) {

      throw new ApiError(
        404,
        'Accident report not found'
      );
    }

    if (user.role === "Worker") {

  if (report.reportedBy.toString() !== user._id.toString()) {

    throw new ApiError(
      403,
      "You can only upload evidence to your own accident reports"
    );

  }

}

    const uploadedImages = [];

    for (const file of files) {
      const uploadResult =
        await cloudinaryService.uploadFile(
          file.path,
          'industrial_worker_safety/accidents'
        );

      uploadedImages.push({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        uploadedBy: user._id,
        uploadedByRole: user.role,
        uploadedAt: new Date()
      });

}
    report.images.push(...uploadedImages);
    await report.save();
    return report;
  }

}


module.exports = new AccidentService();