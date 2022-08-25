const User = require("../models/User");
const MediaFile = require("../models/MediaFile");
const Progress = require("../models/Progress");
const Food = require("../models/Food");
const admin = require("firebase-admin");
const {
  sendEmailVerificationAsync,
} = require("../services/nodemailer/nodemailer");
const { getStorage } = require("firebase-admin/storage");
const { DateUtils, RequestUtils, ProgressUtils } = require("../utils");

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

    const { sex, height, birthday } = user;

    const profileData = Object.fromEntries(
      Object.entries({ sex, height, birthday }).filter(
        ([key, val]) => val !== null
      )
    );

    return res.json(profileData);
  } catch (err) {
    console.log(err);
    res
      .json({ error: { message: "Could not retrieve profile data" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const getGoals = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await User.findUserByUserUID(userUID);
    verifyUserExists(user);
    return res.json(user.goals);
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not get goals" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const getProgress = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await User.findUserByUserUID(userUID);
    verifyUserExists(user);

    const progress = await Progress.find({ userUID }).sort({ date: -1 });

    const weight = ProgressUtils.PROGRESS_TYPES.WEIGHT.toLowerCase();
    const steps = ProgressUtils.PROGRESS_TYPES.STEPS.toLowerCase();
    let cleanProgress = {
      [weight]: [],
      [steps]: [],
    };

    progress.forEach((doc) => {
      if (doc[weight]) {
        cleanProgress[weight].push({
          date: doc.date,
          weight: doc[weight],
          id: doc._id,
        });
      } else if (doc[steps]) {
        cleanProgress[steps].push({
          date: doc.date,
          steps: doc[steps],
          id: doc._id,
        });
      }
    });

    return res.json(cleanProgress);
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not get progress" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const postProfileData = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await User.findUserByUserUID(userUID);
    verifyUserExists(user);

    Object.entries(req.body).forEach(([key, value]) => (user[key] = value));

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
    const { userUID } = req.params;
    const progress = req.body;

    const createdProgress = await Progress.create({
      ...progress,
      userUID,
    });

    const createdProgressCopy = Object.fromEntries(
      Object.entries(createdProgress._doc)
        .filter(([key]) => !["__v", "userUID"].includes(key))
        .map(([key, value]) => [key === "_id" ? "id" : key, value])
    );

    return res.json(createdProgressCopy);
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not post progress" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const postGoal = async (req, res) => {
  try {
    const { userUID } = req.params;
    const user = await User.findUserByUserUID(userUID);
    verifyUserExists(user);

    const goal = req.body;
    user.goals = { ...user.goals._doc, ...goal };
    await user.save();

    return res.json({ message: "Goal added" });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not add goal" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const postFood = async (req, res) => {
  try {
    const { userUID } = req.params;
    const food = req.body;

    // if there is a doc with the same userUID, same searchMethod of barcodeNumber, and same barcodeNumber, update that doc with the incoming data

    // if there is a doc with the same userUID, same searchMethod of food name, and same food name, then update that doc with the incoming data

    // have different responses depending on
    // if a doc was created/updated

    const createdFood = await Food.create({
      ...food,
      userUID,
    });

    const createdFoodCopy = Object.fromEntries(
      Object.entries(createdFood._doc)
        .filter(([key]) => !["__v", "userUID"].includes(key))
        .map(([key, value]) => [key === "_id" ? "id" : key, value])
    );

    return res.json(createdFoodCopy);
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not add food" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const editProgress = async (req, res) => {
  try {
    const { progressID } = req.body;
    const progress = await Progress.findById(progressID);
    Object.entries(req.body.progress).forEach(
      ([key, value]) => (progress[key] = value)
    );

    await progress.save();

    const editedProgressCopy = Object.fromEntries(
      Object.entries(progress._doc)
        .filter(([key]) => !["__v", "userUID"].includes(key))
        .map(([key, value]) => [key === "_id" ? "id" : key, value])
    );

    return res.json(editedProgressCopy);
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not edit progress" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

const deleteProgress = async (req, res) => {
  try {
    const { progressID } = req.body;
    await Progress.findByIdAndDelete(progressID);
    return res.json({ message: "Progress deleted" });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not delete progress" } })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

module.exports = {
  getProfilePicture,
  getGoals,
  getProgress,
  getProfileData,
  createUser,
  postProfileData,
  postProfilePicture,
  postProgress,
  postGoal,
  postFood,
  editProgress,
  deleteProgress,
};
