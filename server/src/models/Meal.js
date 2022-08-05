const mongoose = require("mongoose");
const { ArrayUtils } = require("../utils/index");

const mealSchema = new mongoose.Schema({
  userUid: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "MediaFile",
  },
  foods: {
    type: [
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
    validate: {
      validator: (value) => !ArrayUtils.getArrayIsEmpty(value),
      message: (props) => `${props.value} is an empty array`,
    },
    required: true,
  },
});

module.exports = mongoose.model("Meal", mealSchema);
