const mongoose = require("mongoose");
const { ProgressUtils } = require("../utils");

const { PROGRESS_TYPES, hasExactlyOneProgressType } = ProgressUtils;

const progressSchema = new mongoose.Schema({
  userUID: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  [PROGRESS_TYPES.WEIGHT.toLowerCase()]: {
    type: {
      value: Number,
      unit: {},
      _id: false,
    },
    validate: {
      validator: function () {
        return hasExactlyOneProgressType(this._doc);
      },
      message: (props) => `${props.value} is invalid`,
    },
  },

  [PROGRESS_TYPES.STEPS.toLowerCase()]: {
    type: Number,
    validate: {
      validator: function (steps) {
        return (
          hasExactlyOneProgressType(this._doc) &&
          Number.isInteger(steps) &&
          steps >= 0
        );
      },
      message: (props) => `${props.value} is not a valid step count`,
    },
  },

  [PROGRESS_TYPES.FOOD.toLowerCase()]: {
    type: {
      food: {},
      weight: Number,
      unit: {},
      _id: false,
    },
    validate: {
      validator: function () {
        return hasExactlyOneProgressType(this._doc);
      },
      message: (props) => `${props.value} is invalid`,
    },
  },
});

module.exports = mongoose.model("Progress", progressSchema);
