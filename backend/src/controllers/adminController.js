const User = require('../models/User');
const Booking = require('../models/Booking');
const Quotation = require('../models/Quotation');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const WorkReport = require('../models/WorkReport');

// @desc    Create technician account (Admin only)
// @route   POST /api/admin/technicians
// @access  Private/Admin
const createTechnician = async (req, res) => {
  try {
    const { name, email, password, phone, specialization } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Technician with this email already exists' 
      });
    }

    const technician = await User.create({
      name,
      email,
      password,
      phone,
      role: 'technician',
      specialization,
      status: 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Technician created successfully',
      technician: {
        id: technician._id,
        name: technician.name,
        email: technician.email,
        role: technician.role,
        specialization: technician.specialization,
        status: technician.status,
        createdAt: technician.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all technicians
// @route   GET /api/admin/technicians
// @access  Private/Admin
const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: technicians.length,
      technicians,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update technician
// @route   PUT /api/admin/technicians/:id
// @access  Private/Admin
const updateTechnician = async (req, res) => {
  try {
    const { name, phone, specialization, status, isActive } = req.body;

    const technician = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, specialization, status, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    res.status(200).json({
      success: true,
      technician,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete technician
// @route   DELETE /api/admin/technicians/:id
// @access  Private/Admin
const deleteTechnician = async (req, res) => {
  try {
    const technician = await User.findByIdAndDelete(req.params.id);

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Technician deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const inProgressBookings = await Booking.countDocuments({ status: 'in-progress' });

    const totalQuotations = await Quotation.countDocuments();
    const pendingQuotations = await Quotation.countDocuments({ status: 'pending' });

    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    const availableTechnicians = await User.countDocuments({ role: 'technician', status: 'available' });

    const totalContacts = await Contact.countDocuments();
    const unreadContacts = await Contact.countDocuments({ status: 'unread' });

    const newsletterSubscribers = await Newsletter.countDocuments({ isActive: true });

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name');

    // Recent quotations
    const recentQuotations = await Quotation.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        bookings: { total: totalBookings, pending: pendingBookings, completed: completedBookings, inProgress: inProgressBookings },
        quotations: { total: totalQuotations, pending: pendingQuotations },
        technicians: { total: totalTechnicians, available: availableTechnicians },
        contacts: { total: totalContacts, unread: unreadContacts },
        newsletter: { subscribers: newsletterSubscribers },
      },
      recentBookings,
      recentQuotations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign booking to technician
// @route   PUT /api/admin/bookings/:id/assign
// @access  Private/Admin
const assignBooking = async (req, res) => {
  try {
    const { technicianId, priority, notes } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: technicianId, 
        priority: priority || 'normal',
        notes,
        status: 'confirmed'
      },
      { new: true }
    ).populate('assignedTo', 'name email phone status');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update technician status to busy
    await User.findByIdAndUpdate(technicianId, { status: 'busy' });

    res.status(200).json({
      success: true,
      message: 'Booking assigned successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update quotation status
// @route   PUT /api/admin/quotations/:id/status
// @access  Private/Admin
const updateQuotationStatus = async (req, res) => {
  try {
    const { status, adminNotes, quotedAmount } = req.body;

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, quotedAmount },
      { new: true }
    );

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    res.status(200).json({
      success: true,
      quotation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contacts
// @route   GET /api/admin/contacts
// @access  Private/Admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id/status
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/admin/newsletter
// @access  Private/Admin
const getNewsletterSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset technician password (Admin only)
// @route   PUT /api/admin/technicians/:id/reset-password
// @access  Private/Admin
const resetTechnicianPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    const technician = await User.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found' });
    }

    if (technician.role !== 'technician') {
      return res.status(403).json({ success: false, message: 'Can only reset technician passwords' });
    }

    technician.password = newPassword;
    technician.passwordChangedAt = new Date();
    await technician.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update admin profile & password
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const updateData = { name, phone };

    const admin = await User.findById(req.user.id).select('+password');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required' });
      }
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }
      admin.password = newPassword;
      admin.passwordChangedAt = new Date();
      await admin.save();
    } else {
      await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });
    }

    const updatedAdmin = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      success: true,
      message: newPassword ? 'Password changed successfully' : 'Profile updated successfully',
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
