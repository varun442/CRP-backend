const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  role: {
    type: String,
    enum: ['resident', 'staff', 'admin'],
    default: 'resident'
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;