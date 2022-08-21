const mongoose = require("mongoose");

const PROGRESS_TYPES = {
  WEIGHT: "weight",
  STEPS: "steps",
};

function hasExactlyOneProgressType() {
  return (
    Object.keys(this._doc).filter((key) => PROGRESS_TYPES[key.toUpperCase()])
      .length === 1
  );
}

const progressSchema = new mongoose.Schema({
  userUID: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  [PROGRESS_TYPES.WEIGHT]: {
    type: {
      value: Number,
      unit: {},
    },
    validate: {
      validator: hasExactlyOneProgressType,
      message: (props) => `${props.value} is invalid`,
    },
  },

  [PROGRESS_TYPES.STEPS]: {
    type: Number,
    validator: (steps) =>
      hasExactlyOneProgressType && Number.isInteger(steps) && steps >= 0,
    message: (props) => `${props.value} is not a valid step count`,
  },
});

module.exports = mongoose.model("Progress", progressSchema);
