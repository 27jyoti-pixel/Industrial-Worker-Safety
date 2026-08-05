const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

class CloudinaryService {
  /**
   * Upload file to Cloudinary and clean up temporary local file
   * @param {string} localFilePath - Path to local file
   * @param {string} folder - Target Cloudinary folder name
   * @returns {Object} Upload result containing url and public_id
   */
  async uploadFile(localFilePath, folder = 'industrial_worker_safety') {
    try {
      if (!localFilePath) {
        throw new ApiError(400, 'Local file path is required for upload');
      }

      const result = await cloudinary.uploader.upload(localFilePath, {
        folder,
        resource_type: 'auto'
      });

      // Safely delete local temporary file after upload
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      // Remove temporary file on failure
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      throw new ApiError(500, `Cloudinary upload failed: ${error.message}`);
    }
  }

  /**
   * Delete file from Cloudinary by public ID
   * @param {string} publicId - Cloudinary asset public ID
   */
  async deleteFile(publicId) {
    try {
      if (!publicId) return;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`[Cloudinary Error] Failed to delete file ${publicId}: ${error.message}`);
    }
  }
}

module.exports = new CloudinaryService();

