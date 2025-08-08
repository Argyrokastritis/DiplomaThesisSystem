const mongoose = require('mongoose');

const thesisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  protocolNumber: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed'],
    default: 'Pending'
  },
  grade: {
    type: Number,
    min: 0,
    max: 10
  },
  comments: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Thesis', thesisSchema);
