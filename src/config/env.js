const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/industrial_worker_safety',
  jwt: {
    secret: process.env.JWT_SECRET || 'industrial_worker_safety_super_secret_jwt_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  }
};

module.exports = config;
