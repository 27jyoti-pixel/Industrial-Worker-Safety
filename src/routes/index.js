const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const workerRoutes = require('./workerRoutes');
const accidentRoutes = require('./accidentRoutes');
const claimRoutes = require('./claimRoutes');
const hospitalRoutes = require('./hospitalRoutes');
const complaintRoutes = require('./complaintRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Mount Health Check route
router.use('/health', healthRoutes);

// Mount Authentication routes
router.use('/auth', authRoutes);

// Mount Worker Module routes
router.use('/workers', workerRoutes);

// Mount Accident Reporting routes
router.use('/accidents', accidentRoutes);

// Mount Compensation Claim routes
router.use('/claims', claimRoutes);

// Mount Hospital routes
router.use('/hospitals', hospitalRoutes);

// Mount Safety Complaints routes
router.use('/complaints', complaintRoutes);

// Mount Dashboard routes
router.use('/dashboard', dashboardRoutes);

module.exports = router;