const mongoose = require("mongoose");
const { emailIsValid, generateRandomInteger } = require("../utils/utils");

const EMAIL_VERIFICATION_CODE_LENGTH = 5;

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
        type: Number,
        immutable: true,
        default: () =>
          generateRandomInteger(
            0,
            Math.pow(10, EMAIL_VERIFICATION_CODE_LENGTH)
          ),
      },
      isVerified: {
        type: Boolean,
        required: true,
      },
    },
    required: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
