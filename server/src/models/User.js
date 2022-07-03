const mongoose = require("mongoose");
const { emailIsValid, generateRandomInteger } = require("../utils/utils");

const EMAIL_VERIFICATION_PIN_NUM_DIGITS = 4;

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
      pin: {
        type: Number,
        immutable: true,
        default: () =>
          generateRandomInteger(
            Math.pow(10, EMAIL_VERIFICATION_PIN_NUM_DIGITS - 1),
            Math.pow(10, EMAIL_VERIFICATION_PIN_NUM_DIGITS)
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

// --------------------------- STATICS ---------------------------
userSchema.statics.isAdmin = async function (uid) {
  const user = await this.findOne({ uid: uid });
  return user && user.isAdmin;
}

userSchema.statics.emailInUse = async function (email) {
  return (await this.countDocuments({ email: email })) !== 0;
};

userSchema.statics.findUserByEmail = async function (email) {
  return await this.findOne({ email: email });
};

module.exports = mongoose.model("Users", userSchema);
