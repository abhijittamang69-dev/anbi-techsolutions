const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getMyJobs,
  getJobDetails,
  updateJobStatus,
  submitWorkReport,
  getProfile,
  updateProfile,
} = require('../controllers/technicianController');

// All routes require technician role
router.use(auth, authorize('technician'));

router.get('/dashboard', getDashboard);
router.get('/jobs', getMyJobs);
router.get('/jobs/:id', getJobDetails);
router.put('/jobs/:id/status', updateJobStatus);
router.post('/reports', submitWorkReport);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
