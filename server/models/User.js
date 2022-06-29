const mongoose = require("mongoose");
const { emailIsValid } = require("../utils/utils");

const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowerCase: true,
    validate: {
      validator: emailIsValid,
      message: (props) => `${props.value} is an invalid email`,
    },
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);
