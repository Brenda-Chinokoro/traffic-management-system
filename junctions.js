const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Junction = require('../models/Junction');

// Get all junctions
router.get('/', auth, async (req, res) => {
  try {
    const junctions = await Junction.find().sort({ updatedAt: -1 });
    res.json(junctions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a specific junction
router.get('/:id', auth, async (req, res) => {
  try {
    const junction = await Junction.findById(req.params.id);
    if (!junction) {
      return res.status(404).json({ msg: 'Junction not found' });
    }
    res.json(junction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a junction
router.post('/', auth, async (req, res) => {
  const { name, location, trafficLight, camera, congestion } = req.body;

  try {
    const newJunction = new Junction({
      name,
      location,
      trafficLight,
      camera,
      congestion
    });

    const junction = await newJunction.save();
    res.json(junction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a junction
router.put('/:id', auth, async (req, res) => {
  const { trafficLight, camera, congestion } = req.body;

  // Build junction object
  const junctionFields = {};
  if (trafficLight) junctionFields.trafficLight = trafficLight;
  if (camera) junctionFields.camera = camera;
  if (congestion) junctionFields.congestion = congestion;
  junctionFields.updatedAt = Date.now();

  try {
    let junction = await Junction.findById(req.params.id);
    if (!junction) {
      return res.status(404).json({ msg: 'Junction not found' });
    }

    junction = await Junction.findByIdAndUpdate(
      req.params.id,
      { $set: junctionFields },
      { new: true }
    );

    res.json(junction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;