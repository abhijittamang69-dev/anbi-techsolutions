const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { upload, uploadToCloudinary } = require('../utils/cloudinary');
const {
  createBooking,
  createQuotation,
  createContact,
  subscribeNewsletter,
  unsubscribeNewsletter,
} = require('../controllers/publicController');
const {
  bookingValidation,
  quoteValidation,
  contactValidation,
} = require('../middleware/validator');

// Setup endpoint - creates admin if none exists (safe, only works once)
router.get('/setup', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(200).json({
        success: true,
        message: 'Admin already exists.',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
        },
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@anbitechsolutions.com';
    const admin = await User.create({
      name: 'System Administrator',
      email: adminEmail,
      password: 'admin@123',
      role: 'admin',
      phone: '+977-9763381611',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully. Login with the credentials below.',
      credentials: {
        email: admin.email,
        password: 'admin@123',
      },
      warning: 'Change password after first login!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public API routes (no auth required)
router.post('/bookings', bookingValidation, createBooking);
router.post('/quotations', quoteValidation, createQuotation);
router.post('/contact', contactValidation, createContact);
router.post('/newsletter', subscribeNewsletter);
router.post('/newsletter/unsubscribe', unsubscribeNewsletter);

// Upload routes with file handling
router.post('/bookings/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const result = await uploadToCloudinary(req.file.buffer);
    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/quotations/upload', upload.single('floorplan'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const result = await uploadToCloudinary(req.file.buffer);
    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
