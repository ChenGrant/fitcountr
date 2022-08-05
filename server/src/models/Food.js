const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  servingSize: String,
  image: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "MediaFile",
  },
  nutrients: {
    type: {},
    required: true,
  },
  barcode: String,
});

module.exports = mongoose.model("Food", foodSchema);
