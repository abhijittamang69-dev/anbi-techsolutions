const mongoose = require('mongoose');

const workReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    unique: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  workStatus: {
    type: String,
    enum: ['completed', 'partially-completed', 'needs-followup'],
    required: true,
  },
  workDescription: {
    type: String,
    required: true,
  },
  materialsUsed: {
    type: String,
  },
  photos: [{
    type: String,
  }],
  customerSignature: {
    type: String,
  },
  customerRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  customerFeedback: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

workReportSchema.pre('save', async function(next) {
  if (!this.reportId) {
    const count = await mongoose.model('WorkReport').countDocuments();
    this.reportId = `WR-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('WorkReport', workReportSchema);
