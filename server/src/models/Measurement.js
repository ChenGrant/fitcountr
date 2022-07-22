const mongoose = require("mongoose");

const GRAM = "g";

const ALL_UNITS = [GRAM];

const measurementSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    validator: (value) => ALL_UNITS.includes(value),
    message: (props) => `${props.value} is not included within ${ALL_UNITS}`,
  },
});

module.exports = mongoose.model("Measurement", measurementSchema);
