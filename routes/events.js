const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create a new event (sets status to pending)
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      approvalStatus: 'pending',
      status: 'upcoming'
    });
    await newEvent.save();
    res.status(201).json({ message: 'Event created and pending approval', event: newEvent });
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error: error.message });
  }
});

// Get all events (for regular users - only approved and upcoming/ongoing events)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ 
      approvalStatus: 'approved', 
    });
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all pending events (for admin dashboard)
router.get('/pending', async (req, res) => {
  try {
    const pendingEvents = await Event.find({ approvalStatus: 'pending' });
    res.json(pendingEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending events', error: error.message });
  }
});

router.get('/rejected', async (req, res) => {
  try {
    const approvedEvents = await Event.find({ approvalStatus: 'rejected' });
    res.json(approvedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rejected events', error: error.message });
  }
});

router.get('/approved', async (req, res) => {
  try {
    const approvedEvents = await Event.find({ approvalStatus: 'approved' });
    res.json(approvedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved events', error: error.message });
  }
});

// Approve an event
router.post('/approve/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    event.approvalStatus = 'approved';
    await event.save();
    
    res.json({ message: 'Event approved successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error approving event', error: error.message });
  }
});

// Reject an event
router.post('/reject/:id', async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    event.approvalStatus = 'rejected';
    event.rejectionReason = rejectionReason;
    await event.save();
    
    res.json({ message: 'Event rejected successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting event', error: error.message });
  }
});

module.exports = router;