const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

// Storage configuration - save temporarily in src/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter to allow only image files
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  }
  cb(new ApiError(400, 'Only image files (jpeg, jpg, png, webp) are allowed'));
};

const uploadSingleImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max limit
}).single('image');

const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
}).array('images', 5); // max 5 images

module.exports = {
  uploadSingleImage,
  uploadMultipleImages
};
