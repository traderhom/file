const mongoose = require('mongoose');

const ProjectStatusSchema = new mongoose.Schema({
  label: { type: String, required: true, unique: true, trim: true },
  color: { type: String, required: true, default: 'bg-gray-500' },
  id: { type: String, required: true, unique: true, trim: true }, // for frontend mapping
});

module.exports = mongoose.model('ProjectStatus', ProjectStatusSchema);
