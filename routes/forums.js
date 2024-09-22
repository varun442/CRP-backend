const express = require('express');
const router = express.Router();

const Forum = require('../models/Forum');

// Forum Routes

// Create a new forum post
router.post('/forums', async (req, res) => {
    try {
      const forum = new Forum(req.body);
      await forum.save();
      res.status(201).send(forum);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ errors });
      }
      res.status(500).send('Server error');
    }
  });
  
  // Get all forum posts
  router.get('/', async (req, res) => {
    try {
      const forums = await Forum.find();
      res.send(forums);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Get a specific forum post
  router.get('/:id', async (req, res) => {
    try {
      const forum = await Forum.findById(req.params.id);
      if (!forum) {
        return res.status(404).send();
      }
      res.send(forum);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Update a forum post
  router.patch('/forums/:id', async (req, res) => {
    try {
      const forum = await Forum.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!forum) {
        return res.status(404).send();
      }
      res.send(forum);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Delete a forum post
  router.delete('/forums/:id', async (req, res) => {
    try {
      const forum = await Forum.findByIdAndDelete(req.params.id);
      if (!forum) {
        return res.status(404).send();
      }
      res.send(forum);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  module.exports = router;