const { RequestUtils, FoodUtils } = require("../utils");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

const getFoodFromBarcodeNumber = async (req, res) => {
    try {
        const { barcodeNumber } = req.params;

        const food = await FoodUtils.getFoodFromBarcodeNumberOpenFoodFacts(
            barcodeNumber
        );

        return res.json(food);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [FoodUtils.NO_FOOD_DATA_FROM_BARCODE_NUMBER_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const scanBarcodeImage = async (req, res) => {
    try {
        FoodUtils.assertRequestFilesAreProvided(req.files);

        const { barcodeImageFile } = req.files;

        FoodUtils.assertBarcodeImageIsProvided(barcodeImageFile);

        const barcodeNumber =
            await FoodUtils.getBarcodeNumberFromImageCloudmersive(
                barcodeImageFile.data
            );

        return res.json({ barcodeNumber });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [FoodUtils.NO_BARCODE_IMAGE_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [FoodUtils.NO_REQUEST_FILES_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [FoodUtils.NO_BARCODE_NUMBER_FOUND_FROM_IMAGE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const getFoodsFromQuery = async (req, res) => {
    try {
        const { query, pageNumber, pageSize } = req.params;

        const foods = await FoodUtils.getFoodsFromQueryFoodDataCentral({
            query,
            pageNumber,
            pageSize,
        });

        return res.json(foods);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message);
    }
};

module.exports = {
    getFoodFromBarcodeNumber,
    scanBarcodeImage,
    getFoodsFromQuery,
};
