/**
 * ANBI Tech Solution - Database Schema Reference
 * 
 * This file documents all MongoDB schemas used in the application.
 * Actual models are defined in backend/src/models/
 */

// Users Collection
const userSchema = {
  name: String,           // required
  email: String,          // required, unique
  password: String,         // required, min 6 chars, select: false
  role: String,           // enum: ['admin', 'technician']
  phone: String,
  avatar: String,
  specialization: String, // technician only
  status: String,         // enum: ['available', 'busy', 'offduty']
  totalJobs: Number,      // default: 0
  completedJobs: Number,  // default: 0
  rating: Number,         // min: 0, max: 5, default: 0
  isActive: Boolean,      // default: true
  lastLogin: Date,
  passwordChangedAt: Date,
  createdAt: Date,
  updatedAt: Date,
};

// Bookings Collection
const bookingSchema = {
  bookingId: String,      // unique, auto-generated: BK-YYYY-XXX
  fullName: String,       // required
  companyName: String,
  phone: String,          // required
  email: String,          // required
  district: String,       // required
  service: String,        // required
  preferredDate: Date,    // required
  preferredTime: String,  // required
  address: String,        // required
  message: String,
  imageUrl: String,
  status: String,         // enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']
  assignedTo: ObjectId,   // ref: 'User'
  priority: String,       // enum: ['normal', 'high', 'urgent']
  notes: String,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date,
};

// Quotations Collection
const quotationSchema = {
  quoteId: String,        // unique, auto-generated: QT-YYYY-XXX
  name: String,           // required
  company: String,
  phone: String,          // required
  email: String,          // required
  serviceRequired: String,// required
  projectType: String,  // required
  budget: String,
  district: String,       // required
  message: String,        // required
  floorplanUrl: String,
  status: String,         // enum: ['pending', 'reviewed', 'approved', 'rejected', 'converted']
  adminNotes: String,
  quotedAmount: Number,
  createdAt: Date,
  updatedAt: Date,
};

// Contacts Collection
const contactSchema = {
  name: String,           // required
  email: String,          // required
  phone: String,
  subject: String,        // required
  message: String,        // required
  status: String,         // enum: ['unread', 'read', 'replied']
  createdAt: Date,
};

// Newsletter Collection
const newsletterSchema = {
  email: String,          // required, unique
  isActive: Boolean,      // default: true
  subscribedAt: Date,
};

// Work Reports Collection
const workReportSchema = {
  reportId: String,       // unique, auto-generated: WR-YYYY-XXX
  booking: ObjectId,      // ref: 'Booking', required
  technician: ObjectId,   // ref: 'User', required
  workStatus: String,     // enum: ['completed', 'partially-completed', 'needs-followup']
  workDescription: String,// required
  materialsUsed: String,
  photos: [String],
  customerSignature: String,
  customerRating: Number, // min: 1, max: 5
  customerFeedback: String,
  createdAt: Date,
};

module.exports = {
  userSchema,
  bookingSchema,
  quotationSchema,
  contactSchema,
  newsletterSchema,
  workReportSchema,
};
