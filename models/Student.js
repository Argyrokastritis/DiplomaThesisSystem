const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  am: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  thesis: { type: mongoose.Schema.Types.ObjectId, ref: 'Thesis' }
});

module.exports = mongoose.model('Student', studentSchema);

