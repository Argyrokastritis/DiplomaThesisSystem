const Student = require('../models/Student');
const bcrypt = require('bcryptjs'); // προσθήκη

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

module.exports = { getStudents, createStudent };
