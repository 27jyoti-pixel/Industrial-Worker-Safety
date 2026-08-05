const Hospital = require('../models/hospitalModel');
const ApiError = require('../utils/ApiError');

class HospitalService {
  /**
   * Create a new hospital record
   * @param {Object} hospitalData
   */
  async createHospital(hospitalData) {
    const { registrationNumber } = hospitalData;

    if (registrationNumber) {
      const existing = await Hospital.findOne({ registrationNumber });
      if (existing) {
        throw new ApiError(409, `Hospital with registration number '${registrationNumber}' already exists`);
      }
    }

    const hospital = await Hospital.create(hospitalData);
    return hospital;
  }

  /**
   * Get all hospitals with city, search, and pagination
   * @param {Object} queryParams
   */
  async getAllHospitals(queryParams) {
    const { city, search, facility, page = 1, limit = 10 } = queryParams;

    const filter = { isActive: true };

    if (city) {
      filter['address.city'] = { $regex: city, $options: 'i' };
    }

    if (facility) {
      filter.facilities = { $regex: facility, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const hospitals = await Hospital.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Hospital.countDocuments(filter);

    return {
      hospitals,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  /**
   * Find nearby hospitals using GeoJSON coordinates ($near sphere search)
   * @param {number} latitude
   * @param {number} longitude
   * @param {number} radiusInKm - Search radius in kilometers (default 10km)
   */
  async getNearbyHospitals(latitude, longitude, radiusInKm = 10) {
    if (!latitude || !longitude) {
      throw new ApiError(400, 'Please provide both latitude and longitude coordinates');
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusMeters = parseFloat(radiusInKm) * 1000;

    const hospitals = await Hospital.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radiusMeters
        }
      }
    });

    return hospitals;
  }

  /**
   * Get single hospital by ID
   * @param {string} hospitalId
   */
  async getHospitalById(hospitalId) {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      throw new ApiError(404, 'Hospital not found');
    }
    return hospital;
  }

  /**
   * Get emergency contacts & ambulance numbers for a hospital
   * @param {string} hospitalId
   */
  async getEmergencyContacts(hospitalId) {
    const hospital = await Hospital.findById(hospitalId).select(
      'name phone emergencyContacts ambulanceNumbers address'
    );
    if (!hospital) {
      throw new ApiError(404, 'Hospital not found');
    }
    return {
      hospitalName: hospital.name,
      primaryPhone: hospital.phone,
      emergencyContacts: hospital.emergencyContacts,
      ambulanceNumbers: hospital.ambulanceNumbers,
      address: hospital.address
    };
  }

  /**
   * Update hospital details
   * @param {string} hospitalId
   * @param {Object} updateData
   */
  async updateHospital(hospitalId, updateData) {
    const hospital = await Hospital.findByIdAndUpdate(hospitalId, updateData, {
      new: true,
      runValidators: true
    });

    if (!hospital) {
      throw new ApiError(404, 'Hospital not found');
    }

    return hospital;
  }

  /**
   * Delete hospital profile
   * @param {string} hospitalId
   */
  async deleteHospital(hospitalId) {
    const hospital = await Hospital.findByIdAndDelete(hospitalId);
    if (!hospital) {
      throw new ApiError(404, 'Hospital not found');
    }
    return { message: 'Hospital profile deleted successfully' };
  }
}

module.exports = new HospitalService();
