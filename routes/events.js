const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const User = require('../models/User');
const Issue = require('../models/Issue');
const Forum = require('../models/Forum');
const Points = require('../models/Points');


// Event Routes
// Create a new event
router.post('/', async (req, res) => {
    console.log('Received request body:', req.body);
    try {
      const event = new Event(req.body);
      console.log('Created event object:', event);
      await event.save();
      res.status(201).send(event);
    } catch (error) {
      console.error('Error creating event:', error);
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ errors });
      }
      res.status(500).send('Server error');
    }
  });

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send();
    }
    res.send(event);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an event
router.patch('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) {
      return res.status(404).send();
    }
    res.send(event);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).send();
    }
    res.send(event);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;