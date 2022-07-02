const User = require("../models/User");
const admin = require("firebase-admin");
const { sendEmailVerificationAsync } = require("../nodemailer/nodemailer");

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
        createdUser.emailVerification.code
      );
      return res.json(req.body);
    }

    if (signInMethod === GMAIL_SIGN_IN_METHOD) {
      // create user in mongodb atlas if there are no users with the same email
      if (!(await User.emailInUse(email)))
        await User.create({
          uid,
          email,
          emailVerification: { emailVerification: true },
        });
      return res.json(req.body);
    }
    throw new Error();
  } catch (err) {
    console.log(err)
    return res.json({ message: "Could not create user" });
  }
};

// ------------------------------- verifyEmail -------------------------------
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // verify email corresponds to a user in the database
    if (!(await User.emailInUse(email))) throw new Error();

    const user = await User.findUserByEmail(email);

    console.log(email, user.emailVerification.code)
    // verify that the codes match
    if (user.emailVerification.code === code) {
      user.emailVerification.isVerified = true;
      await user.save();
      return res.json({ message: `Verified email: ${email}`, success: true });
    }

    throw new Error();
  } catch (err) {
    console.log(err)
    return res.json({ message: "Could not verify email" });
  }
};

module.exports = { createUser, verifyEmail };
