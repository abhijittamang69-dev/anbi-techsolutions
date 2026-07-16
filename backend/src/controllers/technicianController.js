const User = require('../models/User');
const Booking = require('../models/Booking');
const WorkReport = require('../models/WorkReport');

// @desc    Get technician dashboard
// @route   GET /api/tech/dashboard
// @access  Private/Technician
const getDashboard = async (req, res) => {
  try {
    const technician = await User.findById(req.user.id).select('-password');

    const activeJobs = await Booking.countDocuments({ 
      assignedTo: req.user.id, 
      status: { $in: ['confirmed', 'in-progress'] } 
    });

    const completedJobs = await Booking.countDocuments({ 
      assignedTo: req.user.id, 
      status: 'completed' 
    });

    const todayJobs = await Booking.find({
      assignedTo: req.user.id,
      preferredDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    }).sort({ preferredTime: 1 });

    res.status(200).json({
      success: true,
      stats: {
        activeJobs,
        completedJobs,
        rating: technician.rating,
        totalJobs: technician.totalJobs,
      },
      todayJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get technician's jobs
// @route   GET /api/tech/jobs
// @access  Private/Technician
const getMyJobs = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { assignedTo: req.user.id };

    if (status) {
      query.status = status;
    }

    const jobs = await Booking.find(query)
      .sort({ preferredDate: -1, preferredTime: 1 })
      .populate('assignedTo', 'name');

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job details
// @route   GET /api/tech/jobs/:id
// @access  Private/Technician
const getJobDetails = async (req, res) => {
  try {
    const job = await Booking.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job status (start/complete)
// @route   PUT /api/tech/jobs/:id/status
// @access  Private/Technician
const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const job = await Booking.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.id },
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Update technician stats
    if (status === 'completed') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { completedJobs: 1, totalJobs: 1 },
        status: 'available',
      });
      job.completedAt = new Date();
      await job.save();
    } else if (status === 'in-progress') {
      await User.findByIdAndUpdate(req.user.id, { status: 'busy' });
    }

    res.status(200).json({
      success: true,
      message: `Job status updated to ${status}`,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit work report
// @route   POST /api/tech/reports
// @access  Private/Technician
const submitWorkReport = async (req, res) => {
  try {
    const { bookingId, workStatus, workDescription, materialsUsed, customerRating, customerFeedback } = req.body;

    // Verify booking belongs to technician
    const booking = await Booking.findOne({
      _id: bookingId,
      assignedTo: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or not assigned to you' });
    }

    const photos = req.files ? req.files.map(file => file.path) : [];

    const report = await WorkReport.create({
      booking: bookingId,
      technician: req.user.id,
      workStatus,
      workDescription,
      materialsUsed,
      photos,
      customerRating,
      customerFeedback,
    });

    // Update booking status to completed
    booking.status = 'completed';
    booking.completedAt = new Date();
    await booking.save();

    // Update technician status
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { completedJobs: 1 },
      status: 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Work report submitted successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get technician profile
// @route   GET /api/tech/profile
// @access  Private/Technician
const getProfile = async (req, res) => {
  try {
    const technician = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, technician });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update technician profile
// @route   PUT /api/tech/profile
// @access  Private/Technician
const updateProfile = async (req, res) => {
  try {
    const { name, phone, specialization } = req.body;

    const technician = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, specialization },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      technician,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getMyJobs,
  getJobDetails,
  updateJobStatus,
  submitWorkReport,
  getProfile,
  updateProfile,
};
