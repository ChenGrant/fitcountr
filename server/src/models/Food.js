const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "MediaFile",
  },
  nutrition: {
    type: {},
    required: true,
  },
  barcode: String,
});

module.exports = mongoose.model("Food", foodSchema);
