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
const mongoURI = "mongodb://localhost:27017/traffic-management"; // Adjust if using a different database name
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.log("MongoDB connection error:", err);
})

.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.static('public')); // or whatever folder has your frontend files

// Routes (we'll add these later)
app.use('/api/users', require('./routes/users'));
app.use('/api/junctions', require('./routes/junctions'));

app.get('/', (req, res) => {
  res.send('Welcome to the Traffic Management System API');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


