const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const { connectDB } = require('../config/database');

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@anbitechsolutions.com';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin account already exists');
      console.log(`   Email: ${adminEmail}`);
      console.log('   Password: admin@123 (if not changed)');
      process.exit(0);
    }

    // Create admin
    const admin = await User.create({
      name: 'System Administrator',
      email: adminEmail,
      password: 'admin@123',
      role: 'admin',
      phone: '+97477955237',
      isActive: true,
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: admin@123`);
    console.log('═══════════════════════════════════════');
    console.log('⚠️  IMPORTANT: Change password after first login!');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
