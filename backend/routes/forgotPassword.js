const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// In-memory store for OTPs (use Redis or DB for production)
const otpStore = {};

// Send OTP to email
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, error: 'User not found.' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };
  // Fetch sender email and password from admin settings
  const Settings = require('../models/Setting');
  const settings = await Settings.findOne({ key: 'senderEmail' });
  const senderEmail = settings?.value || process.env.EMAIL_USER;
  const passwordSettings = await Settings.findOne({ key: 'senderEmailPassword' });
  const senderEmailPassword = passwordSettings?.value || process.env.EMAIL_PASS;
  // Send OTP email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: senderEmail, pass: senderEmailPassword }
  });
  await transporter.sendMail({
    from: senderEmail, // sender (admin configured email)
    to: email, // receiver (user's registered email)
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is: ${otp}`
  });
  res.json({ success: true });
});

// Verify OTP and set new password
router.post('/reset-password', async (req, res) => {
  const { email, otp, password } = req.body;
  const record = otpStore[email];
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.json({ success: false, error: 'Invalid or expired OTP.' });
  }
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, error: 'User not found.' });
  user.password = password; // Hash in production
  await user.save();
  delete otpStore[email];
  res.json({ success: true });
});

module.exports = router;
