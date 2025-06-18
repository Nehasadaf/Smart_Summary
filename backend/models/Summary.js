const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  inputText: String,
  summaryText: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Summary', summarySchema);
