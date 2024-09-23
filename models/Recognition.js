const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
recognitionSchema.index({ fromUserId: 1, date: -1 });
recognitionSchema.index({ toUserId: 1, date: -1 });

const Recognition = mongoose.model('Recognition', recognitionSchema);

module.exports = Recognition;