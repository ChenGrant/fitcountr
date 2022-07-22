const mongoose = require("mongoose");

const dailyGoalsSchema = new mongoose.Schema({
  userUid: {
    type: String,
    required: true,
  },
  weight: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Measurement",
    required: true,
  },
  steps: {
    type: Number,
    required: true,
  },
  nutrition: {
    type: {},
    required: true,
  },
});

module.exports = mongoose.model("DailyGoals", dailyGoalsSchema);
