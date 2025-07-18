const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  company: { type: String },
  topics: [{ type: String }],
  file: {
    originalname: String,
    filename: String,
    path: String,
    mimetype: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contacts', contactSchema); 