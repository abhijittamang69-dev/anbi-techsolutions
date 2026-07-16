const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quoteId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  serviceRequired: {
    type: String,
    required: [true, 'Service is required'],
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
  },
  budget: {
    type: String,
  },
  district: {
    type: String,
    required: [true, 'District is required'],
  },
  message: {
    type: String,
    required: [true, 'Project details are required'],
  },
  floorplanUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected', 'converted'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
  },
  quotedAmount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

quotationSchema.pre('save', async function(next) {
  if (!this.quoteId) {
    const count = await mongoose.model('Quotation').countDocuments();
    this.quoteId = `QT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Quotation', quotationSchema);
