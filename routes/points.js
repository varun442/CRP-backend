const express = require('express');
const router = express.Router();
const Points = require('../models/Points');

// Points Routes

// Create a new points transaction
router.post('/points', async (req, res) => {
  try {
    const pointsTransaction = new Points(req.body);
    await pointsTransaction.save();
    res.status(201).send(pointsTransaction);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ errors });
    }
    res.status(500).send('Server error');
  }
});

// Get all points transactions
router.get('/points', async (req, res) => {
  try {
    const pointsTransactions = await Points.find();
    res.send(pointsTransactions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific points transaction
router.get('/points/:id', async (req, res) => {
  try {
    const pointsTransaction = await Points.findById(req.params.id);
    if (!pointsTransaction) {
      return res.status(404).send();
    }
    res.send(pointsTransaction);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a points transaction
router.patch('/points/:id', async (req, res) => {
  try {
    const pointsTransaction = await Points.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pointsTransaction) {
      return res.status(404).send();
    }
    res.send(pointsTransaction);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a points transaction
router.delete('/points/:id', async (req, res) => {
  try {
    const pointsTransaction = await Points.findByIdAndDelete(req.params.id);
    if (!pointsTransaction) {
      return res.status(404).send();
    }
    res.send(pointsTransaction);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;