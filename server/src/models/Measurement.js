const mongoose = require("mongoose");

const { MeasurementUtils } = require("../utils/index");

const measurementSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: {},
    required: true,
    validator: MeasurementUtils.unitExists,
    message: (props) => `${props.value} is not included within ${ALL_UNITS}`,
  },
});

module.exports = mongoose.model("Measurement", measurementSchema);
