const mongoose = require('mongoose');

const pointsTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    enum: ['event_attendance', 'volunteer_work', 'forum_participation', 'issue_resolution'],
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  },
  forumPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost'
  },
  description: String
}, {
  timestamps: true
});

const PointsTransaction = mongoose.model('PointsTransaction', pointsTransactionSchema);

module.exports = PointsTransaction;