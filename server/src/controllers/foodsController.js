const Food = require("../models/Food");
const User = require("../models/User");
const { RequestUtils, UserUtils } = require("../utils");

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
    getFoods,
    postFood,
    deleteFood,
};
