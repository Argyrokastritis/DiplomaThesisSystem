const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const {
  getTopics,
  getTheses,
  createTopic,
  assignTopicToStudent,
  cancelAssignment,
  getAssignments,
  getInvitations,
  respondToInvitation
} = require('../controllers/instructorController');

const { getTopicById, updateTopic } = require('../controllers/thesisController');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.get('/topics', auth, getTopics);
router.get('/theses', auth, getTheses);
router.get('/topics/:id', auth, getTopicById);
router.get('/assignments', auth, getAssignments);
router.get('/committee-invitations', auth, getInvitations);

router.post('/committee-invitations/respond', auth, respondToInvitation);
router.post('/topics', auth, upload.single('pdf'), createTopic);
router.put('/topics/:id', auth, upload.single('pdf'), updateTopic);

router.post('/assign-topic', auth, assignTopicToStudent);
router.post('/cancel-assignment', auth, cancelAssignment);

module.exports = router;
