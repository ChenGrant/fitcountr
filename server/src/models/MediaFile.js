const mongoose = require("mongoose");
const { StringUtils } = require("../utils/");

const mediaFileSchema = new mongoose.Schema({
  firebaseStoragePath: {
    type: String,
    required: true,
    validator: (value) => !StringUtils.getStringIsEmpty(value),
    message: (props) => `${props.value} is empty`,
  },
  url: {
    type: String,
    required: true,
    validator: (value) => !StringUtils.getStringIsEmpty(value),
    message: (props) => `${props.value} is empty`,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => !StringUtils.getStringIsEmpty(value),
    message: (props) => `${props.value} is empty`,
  },
});

module.exports = mongoose.model("MediaFile", mediaFileSchema);
