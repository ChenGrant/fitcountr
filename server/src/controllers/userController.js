const User = require("../models/User");
const MediaFile = require("../models/MediaFile");
const Measurement = require("../models/Measurement");
const config = require("../config/config");
const admin = require("firebase-admin");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");
const { getStorage } = require("firebase-admin/storage");
const { DateUtils } = require("../utils");

// ------------------------------------ CONSTANTS ------------------------------------
const EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER";
const GMAIL_PROVIDER = "GMAIL_PROVIDER";

const bucket = getStorage().bucket();

const findUserByUserUID = async (userUID) => {
  const user = await User.findOne({ userUID });
  if (user === null) throw new Error("No user matched");
  return user;
};

const setUserProfilePicture = async (
  user,
  storagePath = config.ASSETS.PATH.DEFAULT_PROFILE_PICTURE
) => {
  let profilePicture = await MediaFile.findMediaFileByFirebasePath(storagePath);

  // if pfp is not in mongodb, store it in mongodb
  if (profilePicture === null) {
    profilePicture = await MediaFile.create({
      firebasePath: storagePath,
    });
  }

  user.profilePicture = profilePicture._id;
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

const getProfilePicture = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await findUserByUserUID(userUID);

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
      .status(404);
  }
};

const getProfileData = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await findUserByUserUID(userUID);
    await user.populate("height");
    const { sex, height, birthday } = user;
    return res.json({ sex, height, birthday });
  } catch (err) {
    console.log(err);
    res
      .json({ error: { message: "Could not retrieve profile data" } })
      .status(404);
  }
};

const postProfileData = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await findUserByUserUID(userUID);

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
    res.json({ error: { message: "Could not post profile data" } }).status(404);
  }
};

const postProfilePicture = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await findUserByUserUID(userUID);

    const { profilePictureFile } = req.files;

    const storagePath = `assets/profile_picture/${userUID}`;

    await bucket.file(storagePath).save(profilePictureFile.data, {
      metadata: { contentType: profilePictureFile.mimetype },
    });

    setUserProfilePicture(user, storagePath);

    return res.json({ message: "Profile picture updated" });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not update profile picture" } })
      .status(404);
  }
};

module.exports = {
  getProfilePicture,
  createUser,
  getProfileData,
  postProfileData,
  postProfilePicture,
};
