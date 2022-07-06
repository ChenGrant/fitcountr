const User = require("../models/User");
const admin = require("firebase-admin");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");

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
      // create user in mongodb atlas if no users with the same email exist
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

module.exports = { createUser };
