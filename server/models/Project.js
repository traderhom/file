const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  status: { type: String, enum: ['active', 'draft', 'completed', 'cancelled'], default: 'draft' },
  startDate: String,
  endDate: String,
  members: [String],
  progress: Number,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  tags: [String],
  createdBy: String,
  createdAt: String,
  lastModified: String
});

module.exports = mongoose.model('Project', ProjectSchema);
