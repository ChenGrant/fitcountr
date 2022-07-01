const mongoose = require("mongoose");
const { emailIsValid } = require("../utils/utils");
const uuid = require('uuid')


const userSchema = new mongoose.Schema({
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
  emailVerification: {
    type: {
      code: {
        type: String,
        immutable: true,
        default: () => uuid.v4()
      },
      isVerified: {
        type: Boolean,
        required: true
      }
    },
    required: true
  }
});

module.exports = mongoose.model("Users", userSchema);
