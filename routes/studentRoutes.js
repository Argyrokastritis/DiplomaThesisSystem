const express = require('express');
const router = express.Router();
const { getStudents, createStudent } = require('../controllers/studentController');

router.get('/', getStudents);         // GET /api/students
router.post('/', createStudent);     // POST /api/students

module.exports = router;
