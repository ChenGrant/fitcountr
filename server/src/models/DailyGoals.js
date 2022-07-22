const mongoose = require("mongoose");

const dailyGoalsSchema = new mongoose.Schema({
  userUid: {
    type: String,
    required: true,
  },
  weight: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Measurement",
  },
  steps: {
    type: Number,
  },
  nutrition: {
    type: {},
  },
});

module.exports = mongoose.model("DailyGoals", dailyGoalsSchema);
