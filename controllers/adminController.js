const Thesis = require('../models/Thesis');
const Student = require('../models/Student');

const getAllTheses = async (req, res) => {
  try {
    const theses = await Thesis.find().populate('student').populate('supervisor');
    const formatted = theses.map(t => ({
      id: t._id,
      student: t.student.name,
      title: t.title,
      supervisor: t.supervisor.name,
      status: t.status
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα φόρτωσης διπλωματικών' });
  }
};

const setProtocolNumber = async (req, res) => {
  const { studentId, protocolNumber } = req.body;
  try {
    const thesis = await Thesis.findOne({ student: studentId });
    if (!thesis) return res.status(404).json({ message: 'Δεν βρέθηκε διπλωματική' });
    thesis.protocolNumber = protocolNumber;
    await thesis.save();
    res.json({ message: '✅ Καταχωρήθηκε' });
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα καταχώρησης' });
  }
};

const completeThesis = async (req, res) => {
  const { studentId } = req.body;
  try {
    const thesis = await Thesis.findOne({ student: studentId });
    if (!thesis) return res.status(404).json({ message: 'Δεν βρέθηκε διπλωματική' });
    thesis.status = 'Completed';
    await thesis.save();
    res.json({ message: '✅ Ολοκληρώθηκε' });
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα ολοκλήρωσης' });
  }
};

const importThesisData = async (req, res) => {
  try {
    const data = req.body;
    const newThesis = new Thesis(data);
    await newThesis.save();
    res.json({ message: '✅ Εισαγωγή επιτυχής' });
  } catch (err) {
    res.status(400).json({ message: '❌ Σφάλμα εισαγωγής', error: err });
  }
};

module.exports = {
  getAllTheses,
  setProtocolNumber,
  completeThesis,
  importThesisData
};
