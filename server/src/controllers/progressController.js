const Progress = require("../models/Progress");
const User = require("../models/User");
const { RequestUtils, UserUtils, ProgressUtils } = require("../utils");

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
        return res
            .json({ error: { message: "Could not delete progress" } })
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

module.exports = {
    getProgress,
    postProgress,
    editProgress,
    deleteProgress,
};
