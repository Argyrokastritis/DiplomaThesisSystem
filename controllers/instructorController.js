const Thesis = require('../models/Thesis');
const Student = require('../models/Student');
const Invitation = require('../models/Invitation');

const getTopics = async (req, res) => {
  console.log('getTopics called');
  try {
    const topics = await Thesis.find();
    console.log('Topics from DB:', topics);
    res.json(topics);
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ message: 'Σφάλμα ανάκτησης θεμάτων', error });
  }
};

const getTheses = async (req, res) => {
  console.log('getTheses called');
  // Επιστρέφει διπλωματικές στις οποίες συμμετέχει ο καθηγητής
  res.json([]); // προσωρινά κενό
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await Thesis.find({ assignmentStatus: 'Pending' })
      .populate('assignedTo', 'name email');

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα ανάκτησης αναθέσεων', error: err });
  }
};


const createTopic = async (req, res) => {
  console.log('createTopic called');
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { title, summary } = req.body;
    const pdfPath = req.file ? req.file.path : null;

    if (!title) {
      console.warn('Title is missing!');
      return res.status(400).json({ message: 'Ο τίτλος είναι υποχρεωτικός.' });
    }

    const newTopic = new Thesis({ title, summary, pdf: pdfPath });
    console.log('New topic to save:', newTopic);

    await newTopic.save();
    console.log('Topic saved successfully:', newTopic);

    res.status(201).json({ message: 'Θέμα δημιουργήθηκε!', topic: newTopic });
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(400).json({ message: 'Σφάλμα κατά τη δημιουργία θέματος', error });
  }
};

const assignTopicToStudent = async (req, res) => {
  const { topicId, studentId } = req.body;
  const topic = await Thesis.findById(topicId);
  topic.assignedTo = studentId;
  topic.assignmentStatus = 'Pending';
  await topic.save();
  res.json({ message: 'Θέμα ανατέθηκε προσωρινά', topic });
};

const cancelAssignment = async (req, res) => {
  const { topicId } = req.body;
  const topic = await Thesis.findById(topicId);
  topic.assignedTo = null;
  topic.assignmentStatus = 'Unassigned';
  await topic.save();
  res.json({ message: 'Ανάθεση ακυρώθηκε' });
};

const getInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      instructor: req.user.id,
      status: 'Pending'
    }).populate('thesis', 'title').populate('student', 'name email');

    res.json(invitations);
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα ανάκτησης προσκλήσεων', error: err });
  }
};

const respondToInvitation = async (req, res) => {
  const { invitationId, response } = req.body;

  if (!['Accepted', 'Rejected'].includes(response)) {
    return res.status(400).json({ message: 'Μη έγκυρη απάντηση' });
  }

  try {
    const invitation = await Invitation.findById(invitationId);
    if (!invitation || invitation.instructor.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Δεν βρέθηκε πρόσκληση' });
    }

    invitation.status = response;
    invitation.responseDate = new Date();
    await invitation.save();

    res.json({ message: `Η πρόσκληση ${response === 'Accepted' ? 'αποδεκτή' : 'απορρίφθηκε'}` });
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα απάντησης', error: err });
  }
};

module.exports = {
  getTopics,
  getTheses,
  createTopic,
  assignTopicToStudent,
  cancelAssignment,
  getAssignments,
  getInvitations,          // ✅ προσθέτουμε αυτό
  respondToInvitation      // ✅ αν χρησιμοποιείται
};

