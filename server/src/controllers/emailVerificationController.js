const User = require("../models/User");
const { NumberUtils } = require("../utils/index");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");
const { RequestUtils } = require("../utils");

// ------------------------------------ CONSTANTS ------------------------------------
const { INTERNAL_SERVER_ERROR_CODE } = RequestUtils;

const EMAIL_NOT_IN_USE = "EMAIL_NOT_IN_USE";

const verifyEmailIsInUse = async (email) => {
  if (!(await User.emailInUse(email))) throw new Error(EMAIL_NOT_IN_USE);
};

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

// --------------------------------- getEmailIsInUse ---------------------------------
const getEmailIsInUse = async (req, res) => {
  try {
    const { email } = req.params;
    const emailIsInUse = await User.emailInUse(email);
    return res.json({ emailIsInUse });
  } catch (err) {
    console.log(err);
    res
      .json({
        error: { message: "Could not determine if email is in use" },
      })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

// ------------------------------ getVerificationStatus ------------------------------
const getVerificationStatus = async (req, res) => {
  try {
    const { email } = req.params;

    // verify email corresponds to a user in the database
    await verifyEmailIsInUse(email);

    const user = await User.findUserByEmail(email);

    if (user.emailVerification.isVerified)
      return res.json({ verificationStatus: "Verified" });

    return res.json({ verificationStatus: "Not verified" });
  } catch (err) {
    console.log(err);
    return res
      .json({
        error: { message: "Could not get email verification status" },
      })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

// --------------------------- getEmailVerificationProvider ---------------------------
const getEmailVerificationProvider = async (req, res) => {
  try {
    const { email } = req.params;

    await verifyEmailIsInUse(email);

    const user = await User.findUserByEmail(email);

    return res.json({ emailProvider: user.emailVerification.provider });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not get email provider" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

// ----------------------------------- getPinLength -----------------------------------
const getPinLength = async (req, res) => {
  try {
    const { email } = req.params;

    await verifyEmailIsInUse(email);

    const user = await User.findUserByEmail(email);

    return res.json({
      pinLength: NumberUtils.getIntMagnitudeLength(user.emailVerification.pin),
    });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not get pin length" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

// ----------------------------------- validatePin -----------------------------------
const validatePin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    // verify email corresponds to a user in the database
    await verifyEmailIsInUse(email);

    const user = await User.findUserByEmail(email);

    // check if the request object's body contains a 'pin' property
    if (!pin) throw new Error("No pin provided");

    // if the pins match
    if (user.emailVerification.pin === pin) {
      user.emailVerification.isVerified = true;
      await user.save();
      return res.json({ message: "Pin is valid" });
    }

    return res.json({ message: "Pin is invalid" });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not validate pin" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

// ------------------------------- sendVerificationEmail -------------------------------
const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // verify email corresponds to a user in the database
    await verifyEmailIsInUse(email);

    const user = await User.findUserByEmail(email);
    // send verification email

    await sendEmailVerificationAsync(user.email, user.emailVerification.pin);
    return res.json({ message: "Verification email sent" });
  } catch (err) {
    console.log(err);
    return res
      .json({
        error: { message: "Could not send verification email" },
      })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

module.exports = {
  getEmailIsInUse,
  getVerificationStatus,
  getEmailVerificationProvider,
  getPinLength,
  validatePin,
  sendVerificationEmail,
};
