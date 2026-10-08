const Worker = require('../models/workerModel');
const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const cloudinaryService = require('./cloudinaryService');
const { ROLES } = require('../constants');

const exactFactoryName = (value) => {
  const escapedValue = String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escapedValue}$`, 'i');
};

class WorkerService {
  /**
   * Create a new Worker profile
   * @param {Object} workerData
   * @param {Object} currentUser
   */
  async createWorker(workerData, currentUser) {
    const requestedFactoryName = String(workerData.factoryName || '').trim();
    let factoryName = requestedFactoryName;

    // Keep Factory Admin creates in the same case-insensitive factory scope
    // enforced by worker list and detail reads.
    if (currentUser?.role === ROLES.FACTORY_ADMIN) {
      const assignedFactoryName = String(currentUser.factoryName || '').trim();
      if (!assignedFactoryName || requestedFactoryName.toLowerCase() !== assignedFactoryName.toLowerCase()) {
        throw new ApiError(403, 'Workers can only be created within your assigned factory');
      }
      factoryName = assignedFactoryName;
    }

    const scopedWorkerData = { ...workerData, factoryName };
    const existingEmployeeId = await Worker.findOne({ employeeId: workerData.employeeId });
    if (existingEmployeeId) {
      throw new ApiError(409, `Worker with Employee ID '${workerData.employeeId}' already exists`);
    }

    const existingEmail = await Worker.findOne({ email: workerData.email.toLowerCase() });
    if (existingEmail) {
      throw new ApiError(409, `Worker with email '${workerData.email}' already exists`);
    }

    
    const newUser = await User.create({
      name: scopedWorkerData.name,
      email: scopedWorkerData.email,
      password: 'Worker@123',
      role: 'Worker',
      phone: scopedWorkerData.phone,
      factoryName: scopedWorkerData.factoryName,
      employeeId: scopedWorkerData.employeeId
  });

    const worker = await Worker.create({
      ...scopedWorkerData,
      user: newUser._id,
      createdBy: currentUser._id
    });

    return worker;
  }

  /**
   * Get all workers with filtering, search, and pagination
   * @param {Object} queryParams
   */
  async getAllWorkers(queryParams, currentUser) {
    const { search, factoryName, bloodGroup, page = 1, limit = 10 } = queryParams;

    const filter = {};

    // Keep Factory Admin list results within the same factory scope enforced
    // by getWorkerById, so every listed worker can be opened in the details view.
    if (currentUser?.role === ROLES.FACTORY_ADMIN) {
      if (!currentUser.factoryName) {
        return {
          workers: [],
          pagination: { total: 0, page: parseInt(page, 10), limit: parseInt(limit, 10), totalPages: 0 }
        };
      }
      filter.factoryName = exactFactoryName(currentUser.factoryName);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (factoryName) {
      const factorySearch = { factoryName: { $regex: factoryName, $options: 'i' } };
      if (currentUser?.role === ROLES.FACTORY_ADMIN) {
        filter.$and = [
          { factoryName: filter.factoryName },
          factorySearch
        ];
        delete filter.factoryName;
      } else {
        filter.factoryName = factorySearch.factoryName;
      }
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
   * @param {Object} currentUser
   */
  async getWorkerById(workerId, currentUser) {
    const isFactoryAdmin = currentUser?.role === ROLES.FACTORY_ADMIN;
    const workerFilter = { _id: workerId };

    // Keep Factory Admin detail access within the factory on their account.
    if (isFactoryAdmin) {
      if (!currentUser.factoryName) {
        throw new ApiError(404, 'Worker profile not found');
      }
      workerFilter.factoryName = exactFactoryName(currentUser.factoryName);
    }

    const worker = await Worker.findOne(workerFilter)
      .populate('createdBy', 'name email role')
      .populate({
        path: 'user',
        select: [
          'name', 'email', 'role', 'phone', 'alternatePhone', 'bloodGroup',
          'dateOfBirth', 'residentialAddress', 'city', 'state',
          'emergencyContactName', 'emergencyContactRelationship',
          'emergencyContactNumber', 'factoryName', 'employeeId',
          'department', 'designation', 'shift', 'joiningDate',
          'workLocation', 'supervisor', 'employmentType', 'employeeStatus',
          'avatarId'
        ].join(' ')
      });
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
