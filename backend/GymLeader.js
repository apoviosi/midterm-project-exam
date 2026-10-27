const mongoose = require('mongoose');

const gymLeaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    enum: ['Kanto', 'Johto', 'Hoenn']
  },
  town: {
    type: String,
    required: [true, 'Town is required']
  },
  badge: {
    type: String,
    required: [true, 'Badge name is required']
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required']
  },
  aceLevel: {
    type: Number,
    required: [true, 'Ace level is required'],
    min: 1,
    max: 100
  },
  motto: {
    type: String,
    maxlength: 150,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GymLeader', gymLeaderSchema);