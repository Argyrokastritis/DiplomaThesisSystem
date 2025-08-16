const mongoose = require('mongoose');

const thesisSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  pdf: {
    type: String // path του αρχείου PDF
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
    // required: true // αν θέλεις να είναι υποχρεωτικό μόνο όταν ανατεθεί
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor'
    // required: true
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
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' 
  },
  assignmentStatus: {
  type: String,
  enum: ['Unassigned', 'Pending', 'Confirmed'],
  default: 'Unassigned'
}

}, { timestamps: true });

module.exports = mongoose.model('Thesis', thesisSchema);
