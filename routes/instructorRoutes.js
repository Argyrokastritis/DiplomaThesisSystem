const express = require('express');
const multer = require('multer');
const { getTopics, getTheses, createTopic } = require('../controllers/instructorController');
const { getTopicById, updateTopic } = require('../controllers/thesisController');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/topics', getTopics);
router.get('/theses', getTheses);
router.get('/topics/:id', getTopicById);
router.put('/topics/:id', upload.single('pdf'), updateTopic);
//router.post('/topics', upload.single('pdf'), async (req, res) => {
  //console.log('Request received at /topics');
  // ...υπόλοιπος κώδικας...
router.post('/topics', upload.single('pdf'), createTopic);

;

module.exports = router;