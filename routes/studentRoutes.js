const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getStudents,
  createStudent,
  sendInvitation,
  getMyThesis,
  getStudentProfile,
  updateStudentProfile,
  getInstructors
} = require('../controllers/studentController');

const Student = require('../models/Student');

router.put('/profile', auth, updateStudentProfile);

router.get('/profile', auth, getStudentProfile);

router.get('/instructors', auth, getInstructors);

// 📌 Επιστροφή όλων των φοιτητών
router.get('/', getStudents);          // GET /api/students

// 📌 Δημιουργία νέου φοιτητή
router.post('/', createStudent);       // POST /api/students

// 📌 Διπλωματική που έχει αναλάβει ο φοιτητής
router.get('/my-thesis', auth, getMyThesis); // GET /api/students/my-thesis

// 📌 Αποστολή αιτήματος συμμετοχής σε τριμελή
router.post('/send-invitation', auth, sendInvitation); // POST /api/students/send-invitation

// 📌 Αναζήτηση φοιτητή με όνομα, ΑΜ ή email
router.get('/search', async (req, res) => {
  const { name, am, email } = req.query;

  try {
    let query = {};
    if (name) query.name = { $regex: name, $options: 'i' };  // αναζήτηση με όνομα
    if (am) query.am = am;                                   // αναζήτηση με ΑΜ
    if (email) query.email = email;                          // ακριβής αναζήτηση με email

    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα αναζήτησης', error: err });
  }
});

module.exports = router;
