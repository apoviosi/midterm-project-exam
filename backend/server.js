require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GymLeader = require('./GymLeader');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error(err));

app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await GymLeader.find();
    res.status(200).json(leaders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leaders/:id', async (req, res) => {
  try {
    const leader = await GymLeader.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: 'Gym leader not found' });
    }
    res.status(200).json(leader);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leaders', async (req, res) => {
  try {
    const newLeader = new GymLeader(req.body);
    const savedLeader = await newLeader.save();
    res.status(201).json(savedLeader);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/leaders/:id', async (req, res) => {
  try {
    const updatedLeader = await GymLeader.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLeader) {
      return res.status(404).json({ message: 'Gym leader not found' });
    }
    res.status(200).json(updatedLeader);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/leaders/:id', async (req, res) => {
  try {
    const deletedLeader = await GymLeader.findByIdAndDelete(req.params.id);
    if (!deletedLeader) {
      return res.status(404).json({ message: 'Gym leader not found' });
    }
    res.status(200).json({ message: 'Gym leader deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});