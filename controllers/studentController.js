const Student = require('../models/Student');
const bcrypt = require('bcryptjs'); // προσθήκη
const Invitation = require('../models/Invitation');
const Thesis = require('../models/Thesis');


const getMyThesis = async (req, res) => {
  try {
    console.log('🔍 [getMyThesis] Κλήθηκε από φοιτητή');
    console.log('👤 req.user:', req.user);

    const studentId = req.user.id;
    console.log('🆔 Αναζητούμε διπλωματική για φοιτητή με ID:', studentId);

    const thesis = await Thesis.findOne({
      assignedTo: studentId,
      assignmentStatus: { $in: ['Pending', 'Confirmed'] }
    }).populate('supervisor', 'name email');

    console.log('📄 Αποτέλεσμα αναζήτησης διπλωματικής:', thesis);

    if (!thesis) {
      console.warn('⚠️ Δεν βρέθηκε διπλωματική για τον φοιτητή:', studentId);
      return res.status(404).json({ message: 'Δεν έχεις αναλάβει διπλωματική.' });
    }

    console.log('✅ Διπλωματική βρέθηκε και επιστρέφεται στον client');
    res.json(thesis);
  } catch (err) {
    console.error('❌ Σφάλμα κατά την ανάκτηση διπλωματικής:', err);
    res.status(500).json({ message: 'Σφάλμα ανάκτησης διπλωματικής', error: err });
  }
};



// GET /api/students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // hash ο κωδικός
    const newStudent = new Student({ name, email, password: hashedPassword, phone, address });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: 'Error creating student', error });
  }
};

const sendInvitation = async (req, res) => {
  const { thesisId, instructorId } = req.body;

  try {
    const existing = await Invitation.findOne({
      thesis: thesisId,
      instructor: instructorId,
      student: req.user.id,
      status: 'Pending'
    });

    if (existing) {
      return res.status(400).json({ message: 'Υπάρχει ήδη ενεργό αίτημα προς αυτόν τον καθηγητή.' });
    }

    const invitation = new Invitation({
      thesis: thesisId,
      instructor: instructorId,
      student: req.user.id
    });

    await invitation.save();
    res.status(201).json({ message: '✅ Το αίτημα στάλθηκε με επιτυχία.', invitation });
  } catch (err) {
    res.status(500).json({ message: '❌ Σφάλμα κατά την αποστολή αιτήματος.', error: err });
  }
};

module.exports = { getStudents, createStudent,sendInvitation,getMyThesis };
