// routes/junctions.js
const express = require('express');
const router = express.Router();

// Define routes
router.get('/', (req, res) => {
  res.send('Junctions route');
});

module.exports = router;