const axios = require("axios");
const CloudmersiveBarcodeapiClient = require("cloudmersive-barcodeapi-client");
const config = require("../config/config");

const NO_FOOD_DATA_FROM_BARCODE_NUMBER_ERROR_MESSAGE =
    "No food data found from barcode number";

const NO_REQUEST_FILES_PROVIDED_ERROR_MESSAGE =
    "Request has no files provided.";

const NO_BARCODE_IMAGE_PROVIDED_ERROR_MESSAGE = "No barcode image provided.";

const NO_BARCODE_NUMBER_FOUND_FROM_IMAGE_ERROR_MESSAGE =
    "No barcode number found from image.";

const UNITS = {
    KILOGRAM: "kg",
    GRAM: "g",
};

CloudmersiveBarcodeapiClient.ApiClient.instance.authentications[
    "Apikey"
].apiKey = config.BARCODE_API_KEY;

const apiInstance = new CloudmersiveBarcodeapiClient.BarcodeScanApi();

const assertRequestFilesAreProvided = (requestFiles) => {
    if (!requestFiles) throw new Error(NO_REQUEST_FILES_PROVIDED_ERROR_MESSAGE);
};

const assertBarcodeImageIsProvided = (barcodeImage) => {
    if (!barcodeImage) throw new Error(NO_BARCODE_IMAGE_PROVIDED_ERROR_MESSAGE);
};

const getBarcodeNumberFromImageCloudmersive = async (imageFileBuffer) => {
    const scanBarcodeImageResponse = await new Promise((res, rej) => {
        apiInstance.barcodeScanImage(imageFileBuffer, (error, data) => {
            if (error) {
                rej(error);
                return;
            }
            res(data);
        });
    });

    if (!scanBarcodeImageResponse.Successful)
        throw new Error(NO_BARCODE_NUMBER_FOUND_FROM_IMAGE_ERROR_MESSAGE);

    return scanBarcodeImageResponse.RawText;
};

const getFoodFromBarcodeNumberOpenFoodFacts = async (barcodeNumber) => {
    const SERVING_SIZE_IN_GRAMS = 100;

    const fetchedFoodResponse = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcodeNumber}.json`
    );

    if (fetchedFoodResponse.data.status === 0)
        throw new Error(NO_FOOD_DATA_FROM_BARCODE_NUMBER_ERROR_MESSAGE);

    return {
        name: fetchedFoodResponse.data.product.product_name,
        servingSize: {
            value: SERVING_SIZE_IN_GRAMS,
            unit: UNITS.GRAM,
        },
        nutrients: fetchedFoodResponse.data.product.nutriments,
        barcodeNumber,
    };
};

const getFoodsFromQueryFoodDataCentral = async ({
    query,
    pageNumber,
    pageSize,
    dataType = ["Survey (FNDDS)"],
    requireAllWords = true,
}) => {
    const usdaApiUrl =
        "https://api.nal.usda.gov/fdc/v1/foods/search?" +
        Object.entries({
            api_key: config.FOOD_DATA_CENTRAL_API_KEY,
            query,
            pageNumber,
            dataType,
            pageSize,
            requireAllWords,
        })
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

    const fetchedFoodsResponse = await axios.get(usdaApiUrl);

    return fetchedFoodsResponse.data;
};

module.exports = {
    UNITS,
    NO_FOOD_DATA_FROM_BARCODE_NUMBER_ERROR_MESSAGE,
    NO_BARCODE_IMAGE_PROVIDED_ERROR_MESSAGE,
    NO_REQUEST_FILES_PROVIDED_ERROR_MESSAGE,
    NO_BARCODE_NUMBER_FOUND_FROM_IMAGE_ERROR_MESSAGE,
    assertRequestFilesAreProvided,
    assertBarcodeImageIsProvided,
    getFoodFromBarcodeNumberOpenFoodFacts,
    getFoodsFromQueryFoodDataCentral,
    getBarcodeNumberFromImageCloudmersive,
};
