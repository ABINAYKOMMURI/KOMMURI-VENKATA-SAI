require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const emergencySchema = new mongoose.Schema({
  userName: String,
  time: String,
  location: String,
  emergencyType: String
});

const Emergency = mongoose.model('Emergency', emergencySchema);

app.get('/emergencies', async (req, res) => {
  const emergencies = await Emergency.find();
  res.json(emergencies);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
