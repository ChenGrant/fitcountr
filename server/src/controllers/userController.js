const User = require("../models/User");
const MediaFile = require("../models/MediaFile");
const config = require("../config/config");
const admin = require("firebase-admin");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");

// ------------------------------------ CONSTANTS ------------------------------------
const EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER";
const GMAIL_PROVIDER = "GMAIL_PROVIDER";

const setUserProfilePicture = async (user) => {
  const DEFAULT_PROFILE_PICTURE_STORAGE_PATH =
    config.ASSETS.PATH.DEFAULT_PROFILE_PICTURE;

  let defaultProfilePicture = await MediaFile.findMediaFileByFirebasePath(
    DEFAULT_PROFILE_PICTURE_STORAGE_PATH
  );

  // if default pfp is not in mongodb, store it in mongodb
  if (defaultProfilePicture === null) {
    defaultProfilePicture = await MediaFile.create({
      firebasePath: DEFAULT_PROFILE_PICTURE_STORAGE_PATH,
    });
  }

  user.profilePicture = defaultProfilePicture._id;
  user.save();
};

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

// ------------------------------- createUser -------------------------------
const createUser = async (req, res) => {
  try {
    const { email, provider } = req.body;
    const { userUID } = req.params;

    // verify userUID and email exists in firebase auth
    await admin.auth().getUser(userUID);
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
        _id: userUID,
        userUID,
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

      // set user's profile picture to be the default profile picture
      setUserProfilePicture(createdUser);

      return res.json({ userIsCreated: true });
    }

    if (provider === GMAIL_PROVIDER) {
      // if the email is already in use
      if (await User.emailInUse(email)) {
        const existingUser = await User.findUserByEmail(email);
        // if the existing user's email provider is already gmail
        if (existingUser.emailVerification.provider === GMAIL_PROVIDER) {
          return res.json({
            userIsCreated: true,
            message: "Email already in use, provider already uses Gmail",
          });
        }
        // if the existing user's email provider is not gmail
        existingUser.emailVerification.isVerified = true;
        existingUser.emailVerification.provider = GMAIL_PROVIDER;
        await existingUser.save();
        return res.json({
          userIsCreated: true,
          message: "Email already in use, provider overridden to now use Gmail",
        });
      }

      // create user in mongodb atlas if no users with the same email exist
      const createdUser = await User.create({
        _id: userUID,
        userUID,
        email,
        emailVerification: { isVerified: true, provider: GMAIL_PROVIDER },
      });

      setUserProfilePicture(createdUser);

      return res.json({ userIsCreated: true });
    }

    throw new Error("No provider matched");
  } catch (err) {
    console.log(err.message);
    return res
      .json({ error: { message: "Could not create user" } })
      .status(404);
  }
};

const getProfilePicture = (req, res) => {
  try {
    return res.json({ name: "grant" });
  } catch (err) {
    console.log(err);
    res
      .json({ error: { message: "Could not retrieve profile picture" } })
      .status(404);
  }
};

module.exports = { getProfilePicture, createUser };
