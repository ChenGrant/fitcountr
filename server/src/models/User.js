const mongoose = require("mongoose");
const { NumberUtils, HumanUtils } = require("../utils/index");

const EMAIL_VERIFICATION_PIN_LENGTH = 5;

// -------------------------------------- SCHEMA --------------------------------------
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },

  userUID: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowerCase: true,
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
          NumberUtils.getRandomIntFromInterval(
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

  profilePicture: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "MediaFile",
  },

  height: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Measurement",
  },

  sex: {
    type: String,
    validator: HumanUtils.SEXES.has,
    message: (props) => `${props.value} is not a valid sex`,
  },
  birthday: Date,
});

// ------------------------------------- STATICS -------------------------------------

// given a userUID, this function returns true if that userUID corresponds to
// an admin user and false otherwise
userSchema.statics.isAdmin = async function (userUID) {
  const user = await this.findOne({ userUID: userUID });
  return user && user.isAdmin;
};

// given an email, this function returns true if the email is already
// in use by another user and false otherwise
userSchema.statics.emailInUse = async function (email) {
  return (await this.countDocuments({ email: email })) !== 0;
};

// given an email, this function returns the user with the corresponding email
userSchema.statics.findUserByEmail = async function (email) {
  const user = await this.findOne({ email: email });
  if (!user || user.email !== email) return null;
  return user;
};

module.exports = mongoose.model("Users", userSchema);
