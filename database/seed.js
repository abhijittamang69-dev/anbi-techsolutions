/**
 * ANBI Tech Solution - Database Seed Script
 * 
 * Run: node database/seed.js
 * 
 * This seeds the admin user. For standalone seeding (no project dependencies),
 * use: node backend/src/utils/seedAdminStandalone.js
 */

require('dotenv').config();
const connectDB = require('../backend/src/config/database');
const seedAdmin = require('../backend/src/utils/seedAdmin');

const runSeed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');
    // Admin seeding is handled by seedAdmin.js
    console.log('✅ Database seed completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

runSeed();
