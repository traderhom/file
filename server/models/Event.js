const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String,
  location: String,
  category: String,
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  maxAttendees: Number,
  currentAttendees: Number,
  organizer: String,
  image: String
});

module.exports = mongoose.model('Event', EventSchema);
