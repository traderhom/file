const express = require('express');
const router = express.Router();
const ProjectCategory = require('../models/ProjectCategory');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await ProjectCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new category
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const exists = await ProjectCategory.findOne({ name });
    if (exists) return res.status(409).json({ error: 'Category already exists' });
    const category = new ProjectCategory({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ProjectCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
