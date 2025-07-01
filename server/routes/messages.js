const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages
router.get('/', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Create a message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
