const express = require('express');
const router = express.Router();
const { getStudents, createStudent } = require('../controllers/studentController');
const Student = require('../models/Student');

// 📌 Επιστροφή όλων των φοιτητών
router.get('/', getStudents);          // GET /api/students

// 📌 Δημιουργία νέου φοιτητή
router.post('/', createStudent);       // POST /api/students

// 📌 Αναζήτηση φοιτητή με όνομα ή ΑΜ
router.get('/search', async (req, res) => {
  const { name, am } = req.query;

  try {
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };  // αναζήτηση με regex (case-insensitive)
    if (am) query.am = am;

    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα αναζήτησης', error: err });
  }
});

module.exports = router;
