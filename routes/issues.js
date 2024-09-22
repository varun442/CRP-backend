const express = require('express');
const router = express.Router();

const Issue = require('../models/Issue');


// Create a new issue
router.post('/issues', async (req, res) => {
    try {
      const issue = new Issue(req.body);
      await issue.save();
      res.status(201).send(issue);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ errors });
      }
      res.status(500).send('Server error');
    }
  });
  
  // Get all issues
  router.get('/', async (req, res) => {
    try {
      const issues = await Issue.find();
      res.send(issues);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Get a specific issue
  router.get('/:id', async (req, res) => {
    try {
      const issue = await Issue.findById(req.params.id);
      if (!issue) {
        return res.status(404).send();
      }
      res.send(issue);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  // Update an issue
  router.patch('/issues/:id', async (req, res) => {
    try {
      const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!issue) {
        return res.status(404).send();
      }
      res.send(issue);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Delete an issue
  router.delete('/issues/:id', async (req, res) => {
    try {
      const issue = await Issue.findByIdAndDelete(req.params.id);
      if (!issue) {
        return res.status(404).send();
      }
      res.send(issue);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  module.exports = router;