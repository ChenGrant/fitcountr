const {
  scanBarcodeImageAsync,
} = require("../services/cloudmersive/cloudmersive");
const axios = require("axios");
const config = require("../config/config");

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

    const nutrients = Object.fromEntries(
      Object.entries(fetchedFood.data.product.nutriments)
        .filter(
          ([key, value]) =>
            key.endsWith("_100g") && key !== "energy_100g" && value !== 0
        )
        .map(([key, value]) => {
          switch (key) {
            case "energy-kcal_100g":
              return ["calories", value];
            case "saturated-fat_100g":
              return ["saturated fat", { value, unit: "g" }];
            default:
              return [key.replace("_100g", ""), { value, unit: "g" }];
          }
        })
    );

    return res.json({
      name: fetchedFood.data.product.product_name,
      servingSize: { value: 100, unit: "g" },
      nutrients,
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

    let usda_api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?`;

    Object.entries({
      api_key: config.FOOD_DATA_CENTRAL_API_KEY,
      query,
      pageNumber,
      dataType: ["Survey (FNDDS)"],
      pageSize,
      requireAllWords: true,
    }).forEach(([key, value], index) => {
      usda_api_url += `${index === 0 ? "" : "&"}${key}=${value}`;
    });

    const fetchedFoods = await axios.get(usda_api_url);

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
