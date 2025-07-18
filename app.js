const express = require('express');
const app = express();
require("dotenv").config()
const mongoose = require('mongoose');
const cors=require("cors")
const Contact = require('./models/Contact');
const contactRoutes = require('./routes/contact');
const session = require('express-session');
const path = require('path');
const adminRoutes = require('./routes/admin');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
  secret: 'your_secret_key', // Change this to a strong secret in production
  resave: false,
  saveUninitialized: false,
}));

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
const port = process.env.PORT ;
const mongo=process.env.MONGODB_URI
// Routes
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.use('/api/contact', contactRoutes);
app.use('/admin', adminRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
mongoose.connect(mongo, {

})
.then(() => console.log('Connected to MongoDB!'))
.catch((err) => console.error('MongoDB connection error:', err));