const mongoose = require("mongoose");
const { StringUtils } = require("../utils/stringUtils");

const mediaFileSchema = new mongoose.Schema({
  firebasePath: {
    type: String,
    required: true,
    validate: {
      validator: (value) => !StringUtils.getStringIsEmpty(value),
      message: (props) => `${props.value} is empty`,
    },
  },
});

// ------------------------------------- STATICS -------------------------------------

mediaFileSchema.statics.findMediaFileByFirebasePath = async function (path) {
  const mediaFile = await this.findOne({ firebasePath: path });
  if (!mediaFile || mediaFile.firebasePath !== path) return null;
  return mediaFile;
};

module.exports = mongoose.model("MediaFile", mediaFileSchema);
