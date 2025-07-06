const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: Number,
  language: String,
  concerns: [String],
  mode: String,
});

module.exports = mongoose.model('Client', ClientSchema);
