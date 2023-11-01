const Food = require("../models/Food");
const User = require("../models/User");
const { RequestUtils, UserUtils, FoodUtils } = require("../utils");

const getFoods = async (req, res) => {
    try {
        const { userUID } = req.params;
        const user = await User.findUserByUserUID(userUID);

        await UserUtils.assertUserExists(user);

        const foods = await Food.find({ userUID });

        const clientFormattedFoods =
            FoodUtils.formatFoodDocumentsForClient(foods);

        return res.json(clientFormattedFoods);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

const postFood = async (req, res) => {
    try {
        const { userUID } = req.params;
        const food = req.body;

        const foodDocument = await Food.create({ ...food, userUID });

        const clientFormattedFood = FoodUtils.formatFoodDocumentsForClient([
            foodDocument,
        ]);

        return res.json({ food: clientFormattedFood });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

const deleteFood = async (req, res) => {
    try {
        const { foodID } = req.body;

        await Food.findByIdAndDelete(foodID);

        return res.json({ message: "Food deleted" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

module.exports = {
    getFoods,
    postFood,
    deleteFood,
};
