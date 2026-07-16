const Booking = require('../models/Booking');
const Quotation = require('../models/Quotation');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const { 
  sendBookingNotification, 
  sendQuoteNotification, 
  sendContactNotification 
} = require('../utils/email');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    // Send email notification (async, don't wait)
    sendBookingNotification(booking).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully. We will contact you shortly.',
      booking: {
        id: booking._id,
        bookingId: booking.bookingId,
        fullName: booking.fullName,
        service: booking.service,
        status: booking.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create quotation request
// @route   POST /api/quotations
// @access  Public
const createQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.create(req.body);

    sendQuoteNotification(quotation).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully. We will send you a detailed quote within 24-48 hours.',
      quotation: {
        id: quotation._id,
        quoteId: quotation.quoteId,
        name: quotation.name,
        serviceRequired: quotation.serviceRequired,
        status: quotation.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    sendContactNotification(contact).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you within 24 hours.',
      contact: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject,
        status: contact.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ 
          success: false, 
          message: 'You are already subscribed to our newsletter' 
        });
      }
      existing.isActive = true;
      await existing.save();
      return res.status(200).json({ 
        success: true, 
        message: 'Welcome back! Your subscription is reactivated.' 
      });
    }

    const subscriber = await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
      subscriber: {
        id: subscriber._id,
        email: subscriber.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Email not found in our records' });
    }

    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  createQuotation,
  createContact,
  subscribeNewsletter,
  unsubscribeNewsletter,
};
