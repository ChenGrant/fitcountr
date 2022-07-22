const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Measurement", measurementSchema);
