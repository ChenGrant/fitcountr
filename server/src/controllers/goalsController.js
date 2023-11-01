const User = require("../models/User");
const { UserUtils, RequestUtils } = require("../utils");

const getGoals = async (req, res) => {
    try {
        const { userUID } = req.params;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        return res.json(user.goals);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

const postGoal = async (req, res) => {
    try {
        const { userUID } = req.params;
        const goal = req.body;

        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        user.goals = { ...user.goals._doc, ...goal };
        
        await user.save();

        return res.json({ message: "Goal added" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

module.exports = {
    getGoals,
    postGoal,
};
