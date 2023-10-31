const User = require("../models/User");
const { UserUtils, RequestUtils } = require("../utils");

const getGoals = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        return res.json(user.goals);
    } catch (err) {
        return res
            .json({ error: { message: "Could not get goals" } })
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

const postGoal = async (req, res) => {
    try {
        const { userUID } = req.params;
        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const goal = req.body;
        
        user.goals = { ...user.goals._doc, ...goal };
        await user.save();

        return res.json({ message: "Goal added" });
    } catch (err) {
        return res
            .json({ error: { message: "Could not add goal" } })
            .status(RequestUtils.INTERNAL_SERVER_ERROR_STATUS_CODE);
    }
};

module.exports = {
    getGoals,
    postGoal,
};
