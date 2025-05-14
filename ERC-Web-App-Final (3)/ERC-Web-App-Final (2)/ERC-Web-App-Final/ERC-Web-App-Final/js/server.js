// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Set up Express app
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection (Change this URL to MongoDB Atlas or local DB URI)
mongoose.connect('mongodb://localhost/erc_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// SOS Press Schema (Data structure)
const sosSchema = new mongoose.Schema({
  phone: String,
  time: String,
  location: String,
});

// Create SOS model
const SOS = mongoose.model('SOS', sosSchema);

// Endpoint to save SOS press data
app.post('/api/sos', (req, res) => {
  const { phone, location } = req.body;
  const sosData = new SOS({
    phone,
    time: new Date().toLocaleString(),
    location,
  });

  sosData.save()
    .then(() => res.status(200).json({ message: 'SOS data saved successfully' }))
    .catch(err => res.status(500).json({ message: 'Error saving SOS data', error: err }));
});

// Endpoint to get SOS press history
app.get('/api/sos', (req, res) => {
  SOS.find()
    .then(sosHistory => res.json(sosHistory))
    .catch(err => res.status(500).json({ message: 'Error fetching SOS data', error: err }));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
