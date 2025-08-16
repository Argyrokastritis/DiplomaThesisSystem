const Thesis = require('../models/Thesis');

const getTopicById = async (req, res) => {
  try {
    const topic = await Thesis.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Δεν βρέθηκε θέμα' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα ανάκτησης θέματος', error: err });
  }
};

const updateTopic = async (req, res) => {
  try {
    const { title, summary } = req.body;
    const pdfPath = req.file ? req.file.path : undefined;

    const updated = await Thesis.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(summary && { summary }),
        ...(pdfPath && { pdf: pdfPath })
      },
      { new: true }
    );

    res.json({ message: '✅ Ενημερώθηκε', topic: updated });
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα ενημέρωσης', error: err });
  }
};

module.exports = { getTopicById, updateTopic };
