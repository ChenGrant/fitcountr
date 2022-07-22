const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  userUid: String,
  description: String,
  image: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "MediaFile",
  },
  foods: [
    {
      food: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Food",
      },
      weight: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Measurement",
      },
    },
  ],
});

module.exports = mongoose.model("Meal", mealSchema);
