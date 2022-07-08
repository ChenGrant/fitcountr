const mongoose = require("mongoose");
const { EmailUtils, NumberUtils } = require("../utils/index");

const EMAIL_VERIFICATION_PIN_LENGTH = 4;

// -------------------------------------- SCHEMA --------------------------------------
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
      validator: EmailUtils.emailIsValid,
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
          NumberUtils.generateRandomInteger(
            Math.pow(10, EMAIL_VERIFICATION_PIN_LENGTH - 1),
            Math.pow(10, EMAIL_VERIFICATION_PIN_LENGTH)
          ),
      },
      isVerified: {
        type: Boolean,
        required: true,
      },
      provider: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
});

// ------------------------------------- STATICS -------------------------------------

// given a uid, this function returns true if that uid corresponds to
// an admin user and false otherwise
userSchema.statics.isAdmin = async function (uid) {
  const user = await this.findOne({ uid: uid });
  return user && user.isAdmin;
};

// given an email, this function returns true if the email is already
// in use by another user and false otherwise
userSchema.statics.emailInUse = async function (email) {
  return (await this.countDocuments({ email: email })) !== 0;
};

// given an email, this function returns the user with the corresponding email
userSchema.statics.findUserByEmail = async function (email) {
  return await this.findOne({ email: email });
};

module.exports = mongoose.model("Users", userSchema);
