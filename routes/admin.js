const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Admin credentials (static)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// Middleware to protect admin routes
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
}

// Admin login page
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

// Admin login POST
router.post('/login', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.isAdmin = true;
    return res.redirect('/admin/panel');
  }
  res.render('admin/login', { error: 'Invalid credentials' });
});

// Admin logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// Admin panel (show all contacts)
router.get('/panel', requireAdminAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render('admin/panel', { contacts });
  } catch (err) {
    res.status(500).send('Error loading contacts');
  }
});

module.exports = router; 