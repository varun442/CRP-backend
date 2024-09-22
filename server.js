const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Import routes
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const issueRoutes = require('./routes/issues');
const forumRoutes = require('./routes/forums');
const pointsRoutes = require('./routes/points');

// Use routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/points', pointsRoutes);

app.get('/', (req, res) => {
  res.send('Community Restoration Project API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('/api/events');
  console.log('/api/users');
  console.log('/api/issues');
  console.log('/api/forums');
  console.log('/api/points');
});