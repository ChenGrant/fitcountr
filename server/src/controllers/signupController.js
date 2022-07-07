const User = require("../models/User");
const admin = require("firebase-admin");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");

// ------------------------------- createUser -------------------------------
const createUser = async (req, res) => {
  try {
    const { user, signUpMethod } = req.body;
    const { uid, email } = user;

    // verify uid and email exists in firebase auth
    await admin.auth().getUser(uid);
    await admin.auth().getUserByEmail(email);

    if (signUpMethod === "email and password") {
      // verify email does not already exist in mongodb atlas
      if (await User.emailInUse(email))
        return res.json({ formErrors: { email: "Email already in use" } });

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

    if (signUpMethod === "gmail") {
      // if user with the same gmail already exists, override their login
      // method to use gmail
      if (await User.emailInUse(email)) {
        const existingUser = await User.findUserByEmail(email);
        existingUser.emailVerification.isVerified = true;
        return res.json({
          message: "Login method overridden to now use Gmail",
        });
      }
      // create user in mongodb atlas if no users with the same email exist
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
