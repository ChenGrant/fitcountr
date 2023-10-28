const User = require("../models/User");
const MediaFile = require("../models/MediaFile");
const Progress = require("../models/Progress");
const Food = require("../models/Food");
const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
const {
    DateUtils,
    RequestUtils,
    ProgressUtils,
    emailUtils,
} = require("../utils");

const { INTERNAL_SERVER_ERROR_STATUS_CODE } = RequestUtils;

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
            if (await User.emailIsInUse(email))
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

            const verificationEmailOptions =
                emailUtils.getVerificationEmailOptions(
                    createdUser.email,
                    createdUser.emailVerification.pin
                );

            const sendEmailResponse = await emailUtils.sendEmail(
                verificationEmailOptions
            );

            if (!sendEmailResponse.success)
                throw new RequestUtils.RequestError(
                    `Could not send verification email to ${createdUser.email}.`
                );

            // set user's profile picture to be the default profile picture
            User.setUserProfilePicture(createdUser);

            return res.json({ userIsCreated: true });
        }

        if (provider === GMAIL_PROVIDER) {
            // if the email is already in use
            if (await User.emailIsInUse(email)) {
                const existingUser = await User.findUserByEmail(email);
                // if the existing user's email provider is already gmail
                if (
                    existingUser.emailVerification.provider === GMAIL_PROVIDER
                ) {
                    return res.json({
                        userIsCreated: true,
                        message:
                            "Email already in use, provider already uses Gmail",
                    });
                }
                // if the existing user's email provider is not gmail
                existingUser.emailVerification.isVerified = true;
                existingUser.emailVerification.provider = GMAIL_PROVIDER;
                await existingUser.save();
                return res.json({
                    userIsCreated: true,
                    message:
                        "Email already in use, provider overridden to now use Gmail",
                });
            }

            // create user in mongodb atlas if no users with the same email exist
            const createdUser = await User.create({
                _id: userUID,
                userUID,
                email,
                emailVerification: {
                    isVerified: true,
                    provider: GMAIL_PROVIDER,
                },
            });

            User.setUserProfilePicture(createdUser);

            return res.json({ userIsCreated: true });
        }

        throw new Error("No provider matched");
    } catch (err) {
        console.log(err.message);
        return res
            .json({ error: { message: "Could not create user" } })
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
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
        res.json({
            error: { message: "Could not retrieve profile picture" },
        }).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
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
        res.json({
            error: { message: "Could not retrieve profile data" },
        }).status(INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
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
        const food = ProgressUtils.PROGRESS_TYPES.FOOD.toLowerCase();
        let cleanProgress = {
            [weight]: [],
            [steps]: [],
            [food]: [],
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
            } else if (doc[food]) {
                cleanProgress[food].push({
                    date: doc.date,
                    food: doc[food],
                    id: doc._id,
                });
            }
        });

        return res.json(cleanProgress);
    } catch (err) {
        console.log(err);
        return res
            .json({ error: { message: "Could not get progress" } })
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

const getFoods = async (req, res) => {
    try {
        const { userUID } = req.params;
        const user = await User.findUserByUserUID(userUID);
        verifyUserExists(user);

        const foods = await Food.find({ userUID });

        const cleanFoods = Object.fromEntries(
            foods.map((food) => [
                food._id,
                {
                    name: food.name,
                    nutrients: food.nutrients,
                    servingSize: food.servingSize,
                },
            ])
        );

        return res.json(cleanFoods);
    } catch (err) {
        console.log(err);
        return res
            .json({ error: { message: "Could not get foods" } })
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
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
        res.json({ error: { message: "Could not post profile data" } }).status(
            INTERNAL_SERVER_ERROR_STATUS_CODE
        );
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
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

const postGoal = async (req, res) => {
    try {
        const { userUID } = req.params;
        const user = await User.findUserByUserUID(userUID);
        verifyUserExists(user);

        const goal = req.body;
        console.log(goal);
        user.goals = { ...user.goals._doc, ...goal };
        await user.save();

        return res.json({ message: "Goal added" });
    } catch (err) {
        console.log(err);
        return res
            .json({ error: { message: "Could not add goal" } })
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

const postFood = async (req, res) => {
    try {
        const { userUID } = req.params;
        const food = req.body;

        const existingFoodDoc =
            (await Food.findOne({
                userUID,
                searchMethod: "BARCODE_SEARCH_METHOD",
                barcodeNumber: food.barcodeNumber,
            })) ||
            (await Food.findOne({
                userUID,
                searchMethod: "FOOD_NAME_SEARCH_METHOD",
                name: food.name,
            }));

        if (existingFoodDoc) {
            Object.entries(food).forEach(
                ([key, value]) => (existingFoodDoc[key] = value)
            );

            await existingFoodDoc.save();

            const existingFoodDocCopy = Object.fromEntries(
                Object.entries(existingFoodDoc._doc)
                    .filter(([key]) => !["__v", "userUID"].includes(key))
                    .map(([key, value]) => [key === "_id" ? "id" : key, value])
            );

            return res.send({
                message: "Updated existing food",
                food: existingFoodDocCopy,
            });
        }

        const createdFood = await Food.create({
            ...food,
            userUID,
        });

        const createdFoodCopy = Object.fromEntries(
            Object.entries(createdFood._doc)
                .filter(([key]) => !["__v", "userUID"].includes(key))
                .map(([key, value]) => [key === "_id" ? "id" : key, value])
        );

        return res.json({
            message: "Added food to progress",
            food: createdFoodCopy,
        });
    } catch (err) {
        console.log(err);
        return res
            .json({ error: { message: "Could not add food" } })
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

const deleteFood = async (req, res) => {
    try {
        const { foodID } = req.body;
        await Food.findByIdAndDelete(foodID);
        return res.json({ message: "Food deleted" });
    } catch (err) {
        console.log(err);
        return res
            .json({ error: { message: "Could not delete food" } })
            .status(INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

module.exports = {
    getProfilePicture,
    getGoals,
    getProgress,
    getProfileData,
    getFoods,
    createUser,
    postProfileData,
    postProfilePicture,
    postProgress,
    postGoal,
    postFood,
    editProgress,
    deleteProgress,
    deleteFood,
};
