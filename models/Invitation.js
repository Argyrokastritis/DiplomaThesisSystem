const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  thesis: { type: mongoose.Schema.Types.ObjectId, ref: 'Thesis', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  sentDate: { type: Date, default: Date.now },
  responseDate: Date
});

module.exports = mongoose.model('Invitation', invitationSchema);
