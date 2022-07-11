const User = require("../models/User");
const { NumberUtils } = require("../utils/index");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");

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
    return (await User.emailInUse(email))
      ? res.json({ emailIsInUse: true })
      : res.json({ emailIsInUse: false });
  } catch (err) {
    console.log(err);
    console.log({
      error: { message: "Could not determine if email is in use" },
    });
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
    return res.json({
      error: { message: "Could not get email verification status" },
    });
  }
};

// ----------------------------------- getEmailProvider -----------------------------------
const getEmailProvider = async (req, res) => {
  try {
    const { email } = req.params;

    await verifyEmailIsInUse(email);

    const user = await User.findUserByEmail(email);

    return res.json({ emailProvider: user.emailVerification.provider });
  } catch (err) {
    console.log(err);
    return res.json({ error: { message: "Could not get email provider" } });
  }
};

// ----------------------------------- getPinLength -----------------------------------
const getPinLength = async (req, res) => {
  try {
    const { email } = req.params;

    await verifyEmailIsInUse(email);

    const user = await User.findUserByEmail(email);

    return res.json({
      pinLength: NumberUtils.getIntegerLength(user.emailVerification.pin),
    });
  } catch (err) {
    console.log(err);
    return res.json({ error: { message: "Could not get pin length" } });
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
    return res.json({ error: { message: "Could not validate pin" } });
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
    return res.json({
      error: { message: "Could not send verification email" },
    });
  }
};

module.exports = {
  getEmailIsInUse,
  getVerificationStatus,
  getEmailProvider,
  getPinLength,
  validatePin,
  sendVerificationEmail,
};
