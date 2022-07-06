const User = require("../models/User");
const { NumberUtils } = require("../utils/index");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");

// ------------------------------- verifyEmail -------------------------------
const verifyEmail = async (req, res) => {
  try {
    const { email, pin } = req.body;

    // verify email corresponds to a user in the database
    if (!(await User.emailInUse(email))) {
      return res.json({ message: "Email does not exist" });
    }

    const user = await User.findUserByEmail(email);

    // check if email is already verified
    if (user.emailVerification.isVerified) {
      return res.json({ message: "Email already verified" });
    }

    // check if the request object's body contains a 'pin' property
    if (!pin) {
      return res.json({
        message: "Number of digits in pin",
        pinLength: NumberUtils.getIntegerLength(user.emailVerification.pin),
      });
    }

    // verify that the pins match
    if (user.emailVerification.pin === pin) {
      user.emailVerification.isVerified = true;
      await user.save();
      return res.json({ message: `Verified email: ${email}`, success: true });
    }

    throw new Error("Email verification pins do not match");
  } catch (err) {
    console.log(err);
    return res.json({ message: "Could not verify email" });
  }
};

// --------------------------- sendVerificationEmail ---------------------------
const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findUserByEmail(email);
    // send verification email
    await sendEmailVerificationAsync(user.email, user.emailVerification.pin);
    return res.json({ message: "Verification Email Sent", success: true });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Could not send verification email" });
  }
};

module.exports = { verifyEmail, sendVerificationEmail };
