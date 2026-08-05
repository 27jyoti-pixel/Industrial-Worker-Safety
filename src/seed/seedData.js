const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/userModel');
const Hospital = require('../models/hospitalModel');
const { ROLES } = require('../constants');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // 1. Seed Super Admin User if none exists
    const adminEmail = 'admin@workersafety.gov.in';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const admin = await User.create({
        name: 'Super Administrator',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: ROLES.SUPER_ADMIN,
        phone: '+919900000000',
        factoryName: 'State Safety Headquarters',
        employeeId: 'SA-001'
      });
      console.log(`[Seed] Super Admin created: ${admin.email} (Password: AdminPassword123!)`);
    } else {
      console.log('[Seed] Super Admin already exists.');
    }

    // 2. Seed Sample Hospital
    const hospitalReg = 'HOSP-MH-2026-001';
    const existingHospital = await Hospital.findOne({ registrationNumber: hospitalReg });

    if (!existingHospital) {
      const hospital = await Hospital.create({
        name: 'MIDC Emergency & Trauma Hospital',
        registrationNumber: hospitalReg,
        address: {
          street: 'Plot 10, Main Industrial Corridor',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411026'
        },
        location: {
          type: 'Point',
          coordinates: [73.8567, 18.5204]
        },
        phone: '+912027401111',
        emergencyContacts: [
          { name: 'Emergency Desk', phone: '+919876543210', designation: 'Casualty Incharge' }
        ],
        ambulanceNumbers: ['108', '+912027401112'],
        facilities: ['ICU', 'Burn Care', 'Trauma Center', '24x7 Ambulance']
      });
      console.log(`[Seed] Sample Hospital created: ${hospital.name}`);
    } else {
      console.log('[Seed] Sample Hospital already exists.');
    }

    console.log('[Seed] Data seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
    process.exit(1);
  }
};

seedData();
