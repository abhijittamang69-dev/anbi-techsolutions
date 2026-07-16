const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { createTechnicianValidation } = require('../middleware/validator');
const {
  createTechnician,
  getTechnicians,
  updateTechnician,
  deleteTechnician,
  getDashboardStats,
  assignBooking,
  updateQuotationStatus,
  getContacts,
  updateContactStatus,
  getNewsletterSubscribers,
  resetTechnicianPassword,
  updateAdminProfile,
} = require('../controllers/adminController');

// All routes require admin role
router.use(auth, authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Technicians
router.post('/technicians', createTechnicianValidation, createTechnician);
router.get('/technicians', getTechnicians);
router.put('/technicians/:id', updateTechnician);
router.delete('/technicians/:id', deleteTechnician);
router.put('/technicians/:id/reset-password', resetTechnicianPassword);

// Bookings
router.get('/bookings', async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } },
      ];
    }
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email phone');
    const total = await Booking.countDocuments(query);
    res.status(200).json({ success: true, count: bookings.length, total, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/bookings/:id/assign', assignBooking);
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Quotations
router.get('/quotations', async (req, res) => {
  try {
    const Quotation = require('../models/Quotation');
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.status = status;
    const quotations = await Quotation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Quotation.countDocuments(query);
    res.status(200).json({ success: true, count: quotations.length, total, quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/quotations/:id/status', updateQuotationStatus);

// Contacts
router.get('/contacts', getContacts);
router.put('/contacts/:id/status', updateContactStatus);

// Newsletter
router.get('/newsletter', getNewsletterSubscribers);

// Reports
router.get('/reports', async (req, res) => {
  try {
    const WorkReport = require('../models/WorkReport');
    const reports = await WorkReport.find()
      .sort({ createdAt: -1 })
      .populate('booking', 'bookingId service')
      .populate('technician', 'name');
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin Profile
router.get('/profile', async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/profile', updateAdminProfile);

module.exports = router;
