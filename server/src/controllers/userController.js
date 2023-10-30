const User = require("../models/User");
const Progress = require("../models/Progress");
const Food = require("../models/Food");
const { RequestUtils, ProgressUtils, UserUtils } = require("../utils");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************
const createUser = async (req, res) => {
    try {
        const { email, provider } = req.body;
        const { userUID } = req.params;

        UserUtils.assertProviderIsProvided(provider);
        await UserUtils.assertUserIdIsInFirebase(userUID);
        await UserUtils.assertEmailIsInFirebase(email);

        await UserUtils.createUserWithProvider(email, userUID, provider);

        return res.json({ userIsCreated: true });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_PROVIDER_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [UserUtils.EMAIL_ALREADY_IN_USE_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [UserUtils.NO_PROVIDER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
        });
    }
};

const getProfilePicture = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const profilePictureURL = await UserUtils.getProfilePictureUrl(user);

        return res.json({ profilePictureURL });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const getProfileData = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const profileData = UserUtils.getProfileData(user);

        return res.json(profileData);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const postProfileData = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const newProfileData = req.body;

        await UserUtils.updateProfileData(user, newProfileData);

        return res.json({ message: "Profile data updated" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const postProfilePicture = async (req, res) => {
    try {
        const { userUID } = req.params;
        const { profilePictureFile } = req.files;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        await UserUtils.updateUserProfilePicture(user, profilePictureFile);

        return res.json({ message: "Profile picture updated" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_USER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

// ************************************************************************************
// -------------------------------- ASasfdsafasfaNS ---------------------------------
// ************************************************************************************

const getGoals = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        return res.json(user.goals);
    } catch (err) {
        console.log(err);
        return res
            .json({ error: { message: "Could not get goals" } })
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

const getProgress = async (req, res) => {
    try {
        const { userUID } = req.params;
        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

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
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

const getFoods = async (req, res) => {
    try {
        const { userUID } = req.params;
        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

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
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

const postGoal = async (req, res) => {
    try {
        const { userUID } = req.params;
        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const goal = req.body;
        console.log(goal);
        user.goals = { ...user.goals._doc, ...goal };
        await user.save();

        return res.json({ message: "Goal added" });
    } catch (err) {
        console.log(err);
        return res
            .json({ error: { message: "Could not add goal" } })
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
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
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
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
