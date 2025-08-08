const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Instructor = require('../models/Instructor');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password);

  let user = await Student.findOne({ email });
  let role = 'student';
  console.log('Student found:', user);

  if (!user) {
    user = await Instructor.findOne({ email });
    role = 'instructor';
    console.log('Instructor found:', user);
  }

  if (!user) {
    console.log('No user found for email:', email);
    return res.status(401).json({ message: 'Λανθασμένα στοιχεία' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);

  if (!isMatch) {
    console.log('Password does not match for user:', email);
    return res.status(401).json({ message: 'Λανθασμένα στοιχεία' });
  }

  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '2h' });
  console.log('JWT token generated:', token);

  res.json({ token, role });
});

router.post('/register', async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === 'instructor') {
      user = new Instructor({ name, email, password: hashedPassword, phone, address });
      await user.save();
    } else {
      user = new Student({ name, email, password: hashedPassword, phone, address });
      await user.save();
    }

    res.status(201).json({ message: 'Εγγραφή επιτυχής!' });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate email error
      return res.status(400).json({ message: 'Το email χρησιμοποιείται ήδη. Κάνε εγγραφή με άλλο email.' });
    }
    if (error.name === 'ValidationError') {
      // Validation error (π.χ. required πεδία)
      return res.status(400).json({ message: 'Σφάλμα στα στοιχεία εγγραφής. Έλεγξε τα πεδία και προσπάθησε ξανά.' });
    }
    res.status(400).json({ message: 'Σφάλμα εγγραφής', error });
  }
});

module.exports = router;
