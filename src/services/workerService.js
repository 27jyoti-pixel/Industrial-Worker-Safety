const Worker = require('../models/workerModel');
const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./cloudinaryService');

class WorkerService {
  /**
   * Create a new Worker profile
   * @param {Object} workerData
   * @param {string} createdByUserId
   */
  async createWorker(workerData, createdByUserId) {
    const existingEmployeeId = await Worker.findOne({ employeeId: workerData.employeeId });
    if (existingEmployeeId) {
      throw new ApiError(409, `Worker with Employee ID '${workerData.employeeId}' already exists`);
    }

    const existingEmail = await Worker.findOne({ email: workerData.email.toLowerCase() });
    if (existingEmail) {
      throw new ApiError(409, `Worker with email '${workerData.email}' already exists`);
    }

    
    const newUser = await User.create({
      name: workerData.name,
      email: workerData.email,
      password: 'Worker@123',
      role: 'Worker',
      phone: workerData.phone,
      factoryName: workerData.factoryName,
      employeeId: workerData.employeeId
  });

    console.log("WORKER DATA BEFORE CREATE:", workerData);
    const worker = await Worker.create({
      ...workerData,
      user: newUser._id,
      createdBy: createdByUserId
    });

    return worker;
  }

  /**
   * Get all workers with filtering, search, and pagination
   * @param {Object} queryParams
   */
  async getAllWorkers(queryParams) {
    const { search, factoryName, bloodGroup, page = 1, limit = 10 } = queryParams;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (factoryName) {
      filter.factoryName = { $regex: factoryName, $options: 'i' };
    }

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const workers = await Worker.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Worker.countDocuments(filter);

    return {
      workers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Get a single worker by ID
   * @param {string} workerId
   */
  async getWorkerById(workerId) {
    const worker = await Worker.findById(workerId).populate('createdBy', 'name email role');
    if (!worker) {
      throw new ApiError(404, 'Worker profile not found');
    }
    return worker;
  }

  /**
   * Update worker profile
   * @param {string} workerId
   * @param {Object} updateData
   */
 async updateWorker(workerId, updateData, currentUser) {

  const worker = await Worker.findById(workerId);

  if (!worker) {
    throw new ApiError(404, 'Worker profile not found');
  }

  // Worker can update only their own profile
  if (
    currentUser.role === 'Worker' &&
    worker.user.toString() !== currentUser._id.toString()
  ) {
    throw new ApiError(
      403,
      'You can update only your own profile'
    );
  }

  // Check if updating employeeId or email to another existing record
  if (updateData.employeeId) {
    const existing = await Worker.findOne({
      employeeId: updateData.employeeId,
      _id: { $ne: workerId }
    });

    if (existing) {
      throw new ApiError(409, `Employee ID '${updateData.employeeId}' is already in use`);
    }
  }

  if (updateData.email) {
    const existing = await Worker.findOne({
      email: updateData.email.toLowerCase(),
      _id: { $ne: workerId }
    });

    if (existing) {
      throw new ApiError(409, `Email '${updateData.email}' is already in use`);
    }
  }

  const updatedWorker = await Worker.findByIdAndUpdate(workerId, updateData, {
    new: true,
    runValidators: true
  });

  return updatedWorker;
}


async getMyWorkerProfile(userId) {

  const worker = await Worker.findOne({
    user: userId
  });

  if (!worker) {
    throw new ApiError(404, 'Worker profile not found');
  }

  return worker;
}

  /**
   * Delete worker profile and remove Cloudinary profile image if exists
   * @param {string} workerId
   */


  async deleteWorker(workerId) {
    console.log("DELETE ID:", workerId);

    const worker = await Worker.findById(workerId);

    console.log("FOUND WORKER:", worker);

    if (!worker) {
        throw new ApiError(404, "Worker profile not found");
    }

    await worker.deleteOne();

    return {
        message: "Worker profile deleted successfully"
    };
}
  /**
   * Upload profile image for worker
   * @param {string} workerId
   * @param {Object} file - Multer file object
   */
  async uploadProfileImage(workerId, file) {
    if (!file) {
      throw new ApiError(400, 'Please upload an image file');
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      throw new ApiError(404, 'Worker profile not found');
    }

    // Delete existing Cloudinary image if present
    if (worker.profileImage && worker.profileImage.publicId) {
      await cloudinaryService.deleteFile(worker.profileImage.publicId);
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinaryService.uploadFile(
      file.path,
      'industrial_worker_safety/workers'
    );

    worker.profileImage = {
      url: uploadResult.url,
      publicId: uploadResult.publicId
    };

    await worker.save();
    return worker;
  }
}

module.exports = new WorkerService();
