const mongoose = require('mongoose');

const JunctionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  trafficLight: {
    type: String,
    enum: ['Working', 'Not Working'],
    default: 'Working'
  },
  camera: {
    type: String,
    enum: ['Working', 'Not Working'],
    default: 'Working'
  },
  congestion: {
    type: String,
    enum: ['Normal', 'Congested'],
    default: 'Normal'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Junction', JunctionSchema);