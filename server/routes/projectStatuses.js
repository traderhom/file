const express = require('express');
const router = express.Router();
const ProjectStatus = require('../models/ProjectStatus');

// Get all statuses
router.get('/', async (req, res) => {
  try {
    const statuses = await ProjectStatus.find();
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new status
router.post('/', async (req, res) => {
  try {
    const { id, label, color } = req.body;
    if (!id || !label || !color) return res.status(400).json({ error: 'id, label, and color are required' });
    const exists = await ProjectStatus.findOne({ id });
    if (exists) return res.status(409).json({ error: 'Status already exists' });
    const status = new ProjectStatus({ id, label, color });
    await status.save();
    res.status(201).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a status
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ProjectStatus.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Status not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
