const {
  scanBarcodeImageAsync,
} = require("../services/cloudmersive/cloudmersive");
const axios = require("axios");
const config = require("../config/config");
const { UNITS } = require("../utils/foodUtils");

// ------------------------------------ CONSTANTS ------------------------------------
const { GRAM } = UNITS;

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

// ----------------------------- getFoodFromBarcodeNumber -----------------------------
const getFoodFromBarcodeNumber = async (req, res) => {
  try {
    const { barcodeNumber } = req.params;
    const fetchedFood = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcodeNumber}.json`
    );

    if (fetchedFood.data.status === 0)
      throw new Error("No code or invalid code");

    return res.json({
      name: fetchedFood.data.product.product_name,
      servingSize: { value: 100, unit: GRAM },
      nutrients: fetchedFood.data.product.nutriments,
      barcodeNumber,
    });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not fetch food data" } })
      .status(404);
  }
};

// --------------------------------- scanBarcodeImage ---------------------------------
const scanBarcodeImage = async (req, res) => {
  try {
    const { barcodeImageFile } = req.files;
    return res.json(await scanBarcodeImageAsync(barcodeImageFile.data));
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not scan barcode image" } })
      .status(404);
  }
};

// -------------------------------- getFoodsFromQuery --------------------------------
const getFoodsFromQuery = async (req, res) => {
  try {
    const { query, pageNumber, pageSize } = req.params;
    
    const USDA_API_URL =
      "https://api.nal.usda.gov/fdc/v1/foods/search?" +
      Object.entries({
        api_key: config.FOOD_DATA_CENTRAL_API_KEY,
        query,
        pageNumber,
        dataType: ["Survey (FNDDS)"],
        pageSize,
        requireAllWords: true,
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    const fetchedFoods = await axios.get(USDA_API_URL);

    return res.json(fetchedFoods.data);
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not fetch food data" } })
      .status(404);
  }
};

module.exports = {
  getFoodFromBarcodeNumber,
  scanBarcodeImage,
  getFoodsFromQuery,
};
