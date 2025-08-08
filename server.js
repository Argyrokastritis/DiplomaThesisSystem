const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Φόρτωση μεταβλητών περιβάλλοντος
dotenv.config();

// Σύνδεση με MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Εξυπηρέτηση στατικών αρχείων από τον φάκελο frontend
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});


// API Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/instructors', require('./routes/instructorRoutes'));
app.use('/api/theses', require('./routes/thesisRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/authRoutes'));


// Εκκίνηση server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
