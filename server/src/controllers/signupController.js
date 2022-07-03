const User = require("../models/User");
const admin = require("firebase-admin");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");
const { numberOfDigits } = require("../utils/utils");

// ------------------------------- createUser -------------------------------
const createUser = async (req, res) => {
  try {
    const { user, signInMethod, constants } = req.body;
    const {
      EMAIL_ALREADY_IN_USE,
      GMAIL_SIGN_IN_METHOD,
      EMAIL_PASSWORD_SIGN_IN_METHOD,
    } = constants;
    const { uid, email } = user;

    // verify uid and email exists in firebase auth
    await admin.auth().getUser(uid);
    await admin.auth().getUserByEmail(email);

    if (signInMethod === EMAIL_PASSWORD_SIGN_IN_METHOD) {
      // verify email does not already exist in mongodb atlas
      if (await User.emailInUse(email))
        return res.json({ formErrors: { email: EMAIL_ALREADY_IN_USE } });

      // create user in mongodb atlas
      const createdUser = await User.create({
        uid,
        email,
        emailVerification: { isVerified: false },
      });

      // send email verification
      await sendEmailVerificationAsync(
        createdUser.email,
        createdUser.emailVerification.pin
      );

      return res.json(req.body);
    }

    if (signInMethod === GMAIL_SIGN_IN_METHOD) {
      // create user in mongodb atlas if there are no users with the same email
      if (!(await User.emailInUse(email)))
        await User.create({
          uid,
          email,
          emailVerification: { isVerified: true },
        });

      return res.json(req.body);
    }
    throw new Error("No sign in method provided");
  } catch (err) {
    console.log(err);
    return res.json({ message: "Could not create user" });
  }
};

// ------------------------------- verifyEmail -------------------------------
const verifyEmail = async (req, res) => {
  try {
    const { email, pin } = req.body;

    // verify email corresponds to a user in the database
    if (!(await User.emailInUse(email))) {
      return res.json({ message: "Email does not exist" });
    }

    const user = await User.findUserByEmail(email);

    if (user.emailVerification.isVerified) {
      return res.json({ message: "Email already verified" });
    }

    if (!pin) {
      return res.json({
        message: "Number of digits in pin",
        pinLength: numberOfDigits(user.emailVerification.pin),
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
    await sendEmailVerificationAsync(user.email, user.emailVerification.pin);
    return res.json({ message: "Verification Email Sent", success: true });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Could not send verification email" });
  }
};

module.exports = { createUser, verifyEmail, sendVerificationEmail };
