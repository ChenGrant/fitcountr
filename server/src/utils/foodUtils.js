const axios = require("axios");
const CloudmersiveBarcodeapiClient = require("cloudmersive-barcodeapi-client");
const config = require("../config/config");

const UNITS = {
    KILOGRAM: "kg",
    GRAM: "g",
};

CloudmersiveBarcodeapiClient.ApiClient.instance.authentications[
    "Apikey"
].apiKey = config.BARCODE_API_KEY;

const apiInstance = new CloudmersiveBarcodeapiClient.BarcodeScanApi();

const scanBarcodeImageCloudmersive = async (imageFileBuffer) => {
    const scanBarcodeImageResponse = await new Promise((res, rej) => {
        apiInstance.barcodeScanImage(imageFileBuffer, (error, data) => {
            if (error) {
                rej(error);
                return;
            }
            res(data);
        });
    });

    const barcodeImageData = {
        hasBarcodeNumber: scanBarcodeImageResponse.Successful,
    };

    if (barcodeImageData.hasBarcodeNumber) {
        barcodeImageData["barcodeNumber"] = scanBarcodeImageResponse.RawText;
    }

    return barcodeImageData;
};

const fetchFoodFromBarcodeNumberOpenFoodFacts = async (barcodeNumber) => {
    const SERVING_SIZE_IN_GRAMS = 100;

    const fetchedFoodResponse = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcodeNumber}.json`
    );

    const barcodeNumberData = {
        hasFoodData: fetchedFoodResponse.data.status !== 0,
    };

    if (barcodeNumberData.hasFoodData) {
        barcodeNumberData["data"] = {
            name: fetchedFoodResponse.data.product.product_name,
            servingSize: {
                value: SERVING_SIZE_IN_GRAMS,
                unit: UNITS.GRAM,
            },
            nutrients: fetchedFoodResponse.data.product.nutriments,
            barcodeNumber,
        };
    }

    return barcodeNumberData;
};

const fetchFoodsFromQueryFoodDataCentral = async ({
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
    const fetchedFoods = await axios.get(usdaApiUrl);
    return fetchedFoods;
};

module.exports = {
    UNITS,
    fetchFoodFromBarcodeNumberOpenFoodFacts,
    fetchFoodsFromQueryFoodDataCentral,
    scanBarcodeImageCloudmersive,
};
