const mongoose = require("mongoose");

const mediaFileSchema = new mongoose.Schema({
  firebaseStoragePath: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("MediaFile", mediaFileSchema);
