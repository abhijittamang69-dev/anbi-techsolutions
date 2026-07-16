const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

const bookingValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('service').notEmpty().withMessage('Service is required'),
  body('preferredDate').isISO8601().withMessage('Valid date is required'),
  body('preferredTime').notEmpty().withMessage('Preferred time is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  handleValidationErrors,
];

const quoteValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('serviceRequired').notEmpty().withMessage('Service is required'),
  body('projectType').notEmpty().withMessage('Project type is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('message').trim().notEmpty().withMessage('Project details are required'),
  handleValidationErrors,
];

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  handleValidationErrors,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const createTechnicianValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('specialization').optional().trim(),
  body('phone').optional().trim(),
  handleValidationErrors,
];

module.exports = {
  bookingValidation,
  quoteValidation,
  contactValidation,
  loginValidation,
  createTechnicianValidation,
  handleValidationErrors,
};
