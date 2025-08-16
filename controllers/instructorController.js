const Thesis = require('../models/Thesis');

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

module.exports = { getTopics, getTheses, createTopic};