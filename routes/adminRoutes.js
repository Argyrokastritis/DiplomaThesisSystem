const express = require('express');
const router = express.Router();
const {
  getAllTheses,
  setProtocolNumber,
  completeThesis,
  importThesisData
} = require('../controllers/adminController');

// Προβολή όλων των διπλωματικών
router.get('/theses', getAllTheses);

// Καταχώρηση αριθμού πρακτικού
router.post('/set-protocol', setProtocolNumber);

// Ολοκλήρωση διπλωματικής
router.post('/complete-thesis', completeThesis);

// Εισαγωγή δεδομένων από JSON
router.post('/import-thesis', importThesisData);

module.exports = router;
