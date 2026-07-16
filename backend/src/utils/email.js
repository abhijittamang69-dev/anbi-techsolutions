const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"ANBI Tech Solution" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`📧 Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email send failed:', error.message);
    return false;
  }
};

const sendBookingNotification = async (booking) => {
  const html = `
    <h2>New Service Booking</h2>
    <p><strong>Name:</strong> ${booking.fullName}</p>
    <p><strong>Phone:</strong> ${booking.phone}</p>
    <p><strong>Email:</strong> ${booking.email}</p>
    <p><strong>Service:</strong> ${booking.service}</p>
    <p><strong>District:</strong> ${booking.district}</p>
    <p><strong>Date:</strong> ${booking.preferredDate}</p>
    <p><strong>Time:</strong> ${booking.preferredTime}</p>
    <p><strong>Address:</strong> ${booking.address}</p>
    ${booking.message ? `<p><strong>Message:</strong> ${booking.message}</p>` : ''}
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL || "anbitechsolutions@gmail.com",
    subject: `New Booking: ${booking.service} - ${booking.fullName}`,
    html,
    text: `New booking from ${booking.fullName} for ${booking.service}`,
  });
};

const sendQuoteNotification = async (quote) => {
  const html = `
    <h2>New Quotation Request</h2>
    <p><strong>Name:</strong> ${quote.name}</p>
    <p><strong>Phone:</strong> ${quote.phone}</p>
    <p><strong>Email:</strong> ${quote.email}</p>
    <p><strong>Service:</strong> ${quote.serviceRequired}</p>
    <p><strong>Project Type:</strong> ${quote.projectType}</p>
    <p><strong>Budget:</strong> ${quote.budget || 'Not specified'}</p>
    <p><strong>District:</strong> ${quote.district}</p>
    <p><strong>Details:</strong> ${quote.message}</p>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL || "anbitechsolutions@gmail.com",
    subject: `New Quote Request: ${quote.serviceRequired} - ${quote.name}`,
    html,
    text: `New quote request from ${quote.name} for ${quote.serviceRequired}`,
  });
};

const sendContactNotification = async (contact) => {
  const html = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${contact.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${contact.message}</p>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL || "anbitechsolutions@gmail.com",
    subject: `Contact Form: ${contact.subject} - ${contact.name}`,
    html,
    text: `Message from ${contact.name}: ${contact.message}`,
  });
};

module.exports = {
  sendEmail,
  sendBookingNotification,
  sendQuoteNotification,
  sendContactNotification,
};
