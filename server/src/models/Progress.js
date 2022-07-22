const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userUid: {
    type: String,
    required: true,
  },
  weight: [
    {
      date: {
        type: Date,
        default: () => Date.now(),
        required: true,
      },
      weight: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Measurement",
        required: true,
      },
    },
  ],
  steps: [
    {
      date: {
        type: Date,
        default: () => Date.now(),
        required: true,
      },
      steps: {
        type: Number,
        required: true,
      },
    },
  ],
  meals: [
    {
      date: {
        type: Date,
        default: () => Date.now(),
        required: true,
      },
      meal: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Meal",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Progress", progressSchema);
