const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  conversationId: String
});

module.exports = mongoose.model('Message', MessageSchema);
