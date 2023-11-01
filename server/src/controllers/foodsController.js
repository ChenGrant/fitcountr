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

        let foodDocument = await FoodUtils.getFoodDocument(userUID, food);
        let responseMessage = "";

        if (foodDocument) {
            foodDocument = await FoodUtils.updateFoodDocument(
                foodDocument,
                food
            );
            responseMessage = "Updated existing food";
        } else {
            foodDocument = await Food.create({
                ...food,
                userUID,
            });
            responseMessage = "Added food to progress";
        }

        const clientFormattedFood = FoodUtils.formatFoodDocumentsForClient([
            foodDocument,
        ]);

        return res.json({
            message: responseMessage,
            food: clientFormattedFood,
        });
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
