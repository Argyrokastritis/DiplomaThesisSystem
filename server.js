const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/instructors', require('./routes/instructorRoutes'));
app.use('/api/theses', require('./routes/thesisRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
