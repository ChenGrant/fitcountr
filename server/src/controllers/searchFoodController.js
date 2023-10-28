const { RequestUtils, FoodUtils } = require("../utils");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

const getFoodFromBarcodeNumber = async (req, res) => {
    try {
        const { barcodeNumber } = req.params;

        const fetchFoodResponse =
            await FoodUtils.fetchFoodFromBarcodeNumberOpenFoodFacts(
                barcodeNumber
            );

        if (!fetchFoodResponse.hasFoodData)
            throw new RequestUtils.RequestError(
                `Could not find data for the barcode number ${barcodeNumber}`,
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE
            );

        const fetchedFoodData = fetchFoodResponse.data;

        return res.json(fetchedFoodData);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

const scanBarcodeImage = async (req, res) => {
    try {
        const { barcodeImageFile } = req.files;

        const barcodeImageData = await FoodUtils.scanBarcodeImageCloudmersive(
            barcodeImageFile.data
        );

        return res.json(barcodeImageData);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

const getFoodsFromQuery = async (req, res) => {
    try {
        const { query, pageNumber, pageSize } = req.params;

        const fetchedFoods = await FoodUtils.fetchFoodsFromQueryFoodDataCentral(
            { query, pageNumber, pageSize }
        );

        return res.json(fetchedFoods.data);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

module.exports = {
    getFoodFromBarcodeNumber,
    scanBarcodeImage,
    getFoodsFromQuery,
};
