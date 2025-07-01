const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  metaDescription: String,
  status: { type: String, enum: ['published', 'draft', 'review'], default: 'draft' },
  lastModified: String,
  author: String,
  publishDate: String,
  featuredImage: String,
  seoTitle: String
});

module.exports = mongoose.model('Page', PageSchema);
