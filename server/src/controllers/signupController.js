const User = require("../models/User");
const admin = require("firebase-admin");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");

const EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER";
const GMAIL_PROVIDER = "GMAIL_PROVIDER";

// ------------------------------- createUser -------------------------------
const createUser = async (req, res) => {
  try {
    const { user, provider } = req.body;
    const { uid, email } = user;

    // verify uid and email exists in firebase auth
    await admin.auth().getUser(uid);
    await admin.auth().getUserByEmail(email);

    if (!provider) throw new Error("No provider provided");

    if (provider === EMAIL_PASSWORD_PROVIDER) {
      // verify email does not already exist in mongodb atlas
      if (await User.emailInUse(email))
        return res.json({
          userIsCreated: false,
          message: "Email already in use",
        });

      // create user in mongodb atlas
      const createdUser = await User.create({
        uid,
        email,
        emailVerification: {
          isVerified: false,
          provider: EMAIL_PASSWORD_PROVIDER,
        },
      });

      // send email verification
      await sendEmailVerificationAsync(
        createdUser.email,
        createdUser.emailVerification.pin
      );

      return res.json({ userIsCreated: true });
    }

    if (provider === GMAIL_PROVIDER) {
      // if user with the same gmail already exists, override their
      // email verification provider to use gmail
      if (await User.emailInUse(email)) {
        const existingUser = await User.findUserByEmail(email);
        existingUser.emailVerification.isVerified = true;
        existingUser.emailVerification.provider = GMAIL_PROVIDER;
        await existingUser.save();
        return res.json({
          userIsCreated: true,
          message: "Email already in use, provider overridden to now use Gmail",
        });
      }

      // create user in mongodb atlas if no users with the same email exist
      await User.create({
        uid,
        email,
        emailVerification: { isVerified: true, provider: GMAIL_PROVIDER },
      });

      return res.json({ userIsCreated: true });
    }

    throw new Error("No provider matched");
  } catch (err) {
    console.log(err);
    return res.json({ error: { message: "Could not create user" } });
  }
};

module.exports = { createUser };
