const User = require("../models/User");
const MediaFile = require("../models/MediaFile");
const admin = require("firebase-admin");
const DateUtils = require("../utils/dateUtils");
const EmailUtils = require("./emailService");
const { getFirebaseStorageBucket } = require("../config");

// ************************************************************************************
// --------------------------------- ERROR MESSAGES ----------------------------------
// ************************************************************************************

const NO_PROVIDER_PROVIDED_ERROR_MESSAGE = "No provider provided";
const EMAIL_ALREADY_IN_USE_ERROR_MESSAGE = "Error already in use";
const NO_PROVIDER_MATCHED_ERROR_MESSAGE = "No provider matched";
const NO_USER_MATCHED_ERROR_MESSAGE = "No user matched";

// ************************************************************************************
// ------------------------------------ CONSTANTS -------------------------------------
// ************************************************************************************

const EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER";
const GMAIL_PROVIDER = "GMAIL_PROVIDER";

// ************************************************************************************
// -------------------------------- ASSERT FUNCTIONS ---------------------------------
// ************************************************************************************

const assertUserExists = async (user) => {
    if (user === null) throw new Error(NO_USER_MATCHED_ERROR_MESSAGE);
};

const assertUserIdIsInFirebase = async (userUid) => {
    await admin.auth().getUser(userUid);
};

const assertEmailIsInFirebase = async (email) => {
    await admin.auth().getUserByEmail(email);
};

const assertEmailIsNotInUse = async (email) => {
    const emailIsInUse = await User.emailIsInUse(email);
    if (emailIsInUse) throw new Error(EMAIL_ALREADY_IN_USE_ERROR_MESSAGE);
};

const assertProviderIsProvided = (provider) => {
    if (!provider) throw new Error(NO_PROVIDER_PROVIDED_ERROR_MESSAGE);
};

const createUserWithProvider = async (email, userUID, provider) => {
    switch (provider) {
        case GMAIL_PROVIDER:
            await createUserWithGmailProvider(userUID, email);
            break;

        case EMAIL_PASSWORD_PROVIDER:
            await createUserWithEmailPasswordProvider(userUID, email);
            break;

        default:
            throw new Error(NO_PROVIDER_MATCHED_ERROR_MESSAGE);
    }
};

const createUserWithGmailProvider = async function (userUID, email) {
    const emailIsInUse = await User.emailIsInUse(email);
    if (emailIsInUse) {
        const user = await User.findUserByEmail(email);
        await updateUserEmailProviderToGmail(user);
        return;
    }
    const createdUser = await User.create({
        _id: userUID,
        userUID,
        email,
        emailVerification: {
            isVerified: true,
            provider: GMAIL_PROVIDER,
        },
    });
    await updateUserProfilePicture(createdUser);
};

const createUserWithEmailPasswordProvider = async function (userUID, email) {
    assertEmailIsNotInUse(email);
    const createdUser = await User.create({
        _id: userUID,
        userUID,
        email,
        emailVerification: {
            isVerified: false,
            provider: EMAIL_PASSWORD_PROVIDER,
        },
    });
    updateUserProfilePicture(createdUser);
    const verificationEmailOptions = EmailUtils.getVerificationEmailOptions(
        createdUser.email,
        createdUser.emailVerification.pin
    );

    await EmailUtils.sendEmail(verificationEmailOptions);
};

const getProfilePictureUrl = async (user) => {
    const bucket = getFirebaseStorageBucket();

    const profilePicture = await MediaFile.findById(user.profilePicture);

    const signedUrl = await bucket
        .file(profilePicture.firebasePath)
        .getSignedUrl({
            action: "read",
            expires: DateUtils.addDays(new Date(), 7),
        });

    return signedUrl[0];
};

const getProfileData = (user) => {
    const { sex, height, birthday } = user;

    return Object.fromEntries(
        Object.entries({ sex, height, birthday }).filter(
            ([key, val]) => val !== null
        )
    );
};

const updateProfileData = async (user, profileData) => {
    Object.entries(profileData).forEach(([key, value]) => (user[key] = value));
    await user.save();
};

const updateUserIsVerified = async (user, isVerified) => {
    user.emailVerification.isVerified ||= isVerified;
    await user.save();
};

const updateUserEmailProviderToGmail = async (user) => {
    user.emailVerification = {
        isVerified: true,
        provider: GMAIL_PROVIDER,
    };
    await user.save();
};

const updateUserProfilePicture = async (user, profilePictureFile = null) => {
    const bucket = getFirebaseStorageBucket();

    const firebaseStoragePath = profilePictureFile
        ? `assets/profile_picture/${user.userUID}`
        : process.env.DEFAULT_PROFILE_PICTURE_FIREBASE_STORAGE_PATH;

    if (profilePictureFile) {
        // save profile picture to media storage
        await bucket.file(firebaseStoragePath).save(profilePictureFile.data, {
            metadata: { contentType: profilePictureFile.mimetype },
        });
    }

    // find MediaFile schema instance that matches the storage path and
    // make the user's profile picture reference that MediaFile schema instance
    let profilePicture = await MediaFile.findMediaFileByFirebasePath(
        firebaseStoragePath
    );

    const profilePictureDoesNotExist = profilePicture === null;

    if (profilePictureDoesNotExist) {
        profilePicture = await MediaFile.create({
            firebasePath: firebaseStoragePath,
        });
    }

    user.profilePicture = profilePicture._id;
    await user.save();
};

module.exports = {
    NO_PROVIDER_PROVIDED_ERROR_MESSAGE,
    EMAIL_ALREADY_IN_USE_ERROR_MESSAGE,
    NO_PROVIDER_MATCHED_ERROR_MESSAGE,
    NO_USER_MATCHED_ERROR_MESSAGE,
    assertUserIdIsInFirebase,
    assertEmailIsInFirebase,
    assertEmailIsNotInUse,
    assertProviderIsProvided,
    createUserWithProvider,
    assertUserExists,
    createUserWithGmailProvider,
    createUserWithEmailPasswordProvider,
    getProfilePictureUrl,
    getProfileData,
    updateProfileData,
    updateUserIsVerified,
    updateUserProfilePicture,
};
