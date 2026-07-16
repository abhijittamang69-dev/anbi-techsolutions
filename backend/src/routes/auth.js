const express = require('express');
const router = express.Router();
const { login, getMe, changePassword, logout } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { loginValidation } = require('../middleware/validator');

// Public routes
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', auth, getMe);
router.put('/change-password', auth, changePassword);
router.post('/logout', auth, logout);

module.exports = router;
