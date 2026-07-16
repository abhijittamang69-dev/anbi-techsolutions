const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Inline schema for standalone seeding
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'technician'], default: 'technician' },
  phone: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@anbitechsolutions.com';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✅ Admin already exists');
      console.log(`   Email: ${adminEmail}`);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'System Administrator',
      email: adminEmail,
      password: 'admin@123',
      role: 'admin',
      phone: '+97477955237',
      isActive: true,
    });

    console.log('\n✅ Admin account created!');
    console.log('═══════════════════════════════════════');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: admin@123`);
    console.log('═══════════════════════════════════════');
    console.log('⚠️  Change password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
