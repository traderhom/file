const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all pages
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single page by ID
router.get('/:id', async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new page
router.post('/',
  auth,
  [
    body('title').isString().notEmpty(),
    body('slug').isString().notEmpty(),
    body('content').isString().notEmpty(),
    body('status').optional().isIn(['published', 'draft', 'review'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const page = new Page(req.body);
      await page.save();
      res.status(201).json(page);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Update a page
router.put('/:id',
  auth,
  [
    body('title').isString().notEmpty(),
    body('slug').isString().notEmpty(),
    body('content').isString().notEmpty(),
    body('status').optional().isIn(['published', 'draft', 'review'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!page) return res.status(404).json({ error: 'Page not found' });
      res.json(page);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// Delete a page
router.delete('/:id', auth, async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ message: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
