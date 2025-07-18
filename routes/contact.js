const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Multer disk storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/contact
router.post('/', upload.single('file'), async (req, res) => {
  console.log('BODY:', req.body); // Debug line
  console.log('FILE:', req.file); // Debug line
  const { name, email, phone, message, company, topics } = req.body;
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Name, email, phone, and message are required.' });
  }
  try {
    // If topics is sent as a comma-separated string, convert to array
    const topicsArray = topics
      ? Array.isArray(topics)
        ? topics
        : topics.split(',').map(t => t.trim())
      : undefined;
    const contact = new Contact({
      name,
      email,
      phone,
      message,
      company,
      topics: topicsArray,
      file: req.file
        ? {
            originalname: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
          }
        : undefined,
    });
    await contact.save();

    // Send email with contact info
    // Configure your email transport (example uses Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sakilhossain.com@gmail.com', // your Gmail address
        pass: 'vabv ryyj xisx eplf'   // your Gmail app password
      }
    });

    // Prepare email content
    const mailOptions = {
      from: contact.email, // sender address (submitter's email)
      to: 'sakilhossain.com@gmail.com',   // your email address (recipient)
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Submission</h2>
        <p><b>Name:</b> ${contact.name}</p>
        <p><b>Email:</b> ${contact.email}</p>
        <p><b>Phone:</b> ${contact.phone}</p>
        <p><b>Company:</b> ${contact.company || ''}</p>
        <p><b>Topics:</b> ${(contact.topics || []).join(', ')}</p>
        <p><b>Message:</b> ${contact.message}</p>
        ${contact.file && contact.file.filename ? `<p><b>File:</b> <a href="${req.protocol}://${req.get('host')}/uploads/${contact.file.filename}">Download</a></p>` : ''}
        <p><b>Submitted At:</b> ${contact.createdAt.toLocaleString()}</p>
      `
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'Contact form submitted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact form.' });
  }
});

module.exports = router; 