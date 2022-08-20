const User = require("../models/User");
const MediaFile = require("../models/MediaFile");
const Measurement = require("../models/Measurement");
const admin = require("firebase-admin");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");
const { getStorage } = require("firebase-admin/storage");
const { DateUtils } = require("../utils");
const { RequestUtils } = require("../utils");

const { INTERNAL_SERVER_ERROR_CODE } = RequestUtils;

// ------------------------------------ CONSTANTS ------------------------------------
const EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER";
const GMAIL_PROVIDER = "GMAIL_PROVIDER";

const bucket = getStorage().bucket();

const verifyUserExists = async (user) => {
  if (user === null) throw new Error("No user matched");
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
      User.setUserProfilePicture(createdUser);

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

      User.setUserProfilePicture(createdUser);

      return res.json({ userIsCreated: true });
    }

    throw new Error("No provider matched");
  } catch (err) {
    console.log(err.message);
    return res
      .json({ error: { message: "Could not create user" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const getProfilePicture = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await User.findUserByUserUID(userUID);
    verifyUserExists(user);

    const profilePicture = await MediaFile.findById(user.profilePicture);

    const response = await bucket
      .file(profilePicture.firebasePath)
      .getSignedUrl({
        action: "read",
        expires: DateUtils.addDays(new Date(), 7),
      });

    return res.json({ profilePictureURL: response[0] });
  } catch (err) {
    console.log(err);
    res
      .json({ error: { message: "Could not retrieve profile picture" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const getProfileData = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await User.findUserByUserUID(userUID);
    verifyUserExists(user);
    await user.populate("height");

    const { sex, height, birthday } = user;
    const profileData = Object.fromEntries(
      Object.entries({ sex, height, birthday }).filter(([key, val]) => {
        switch (key) {
          case "height":
            return val.value !== null;
          default:
            return val !== null;
        }
      })
    );

    return res.json(profileData);
  } catch (err) {
    console.log(err);
    res
      .json({ error: { message: "Could not retrieve profile data" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const postProfileData = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await User.findUserByUserUID(userUID);
    verifyUserExists(user);

    for (const property in req.body) {
      const val = req.body[property];
      switch (property) {
        case "height":
          if (!user[property]) {
            user[property] = (await Measurement.create(val))._id;
            break;
          }
          await Measurement.replaceOne({ _id: user[property] }, val);
          break;

        default:
          user[property] = val;
      }
    }
    await user.save();
    return res.json({ message: "Profile data updated" });
  } catch (err) {
    console.log(err);
    res
      .json({ error: { message: "Could not post profile data" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const postProfilePicture = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await User.findUserByUserUID(userUID);
    verifyUserExists(user);

    const { profilePictureFile } = req.files;

    const storagePath = `assets/profile_picture/${userUID}`;

    await bucket.file(storagePath).save(profilePictureFile.data, {
      metadata: { contentType: profilePictureFile.mimetype },
    });

    User.setUserProfilePicture(user, storagePath);

    return res.json({ message: "Profile picture updated" });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not update profile picture" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const postProgress = async (req, res) => {
  try {
    console.log(req.body);
    return res.json({ message: "Progress added" });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not post progress" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

module.exports = {
  getProfilePicture,
  createUser,
  getProfileData,
  postProfileData,
  postProfilePicture,
  postProgress,
};
