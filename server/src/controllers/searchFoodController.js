const {
  scanBarcodeImageAsync,
} = require("../services/cloudmersive/cloudmersive");
const axios = require("axios");
const config = require("../config/config");

const getNutritionFromBarcodeNumber = async (req, res) => {
  try {
    const { barcodeNumber } = req.params;
    const fetchedNutrition = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcodeNumber}.json`
    );

    if (fetchedNutrition.data.status === 0)
      throw new Error("No code or invalid code");

    const nutriments = Object.fromEntries(
      Object.entries(fetchedNutrition.data.product.nutriments)
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
      name: fetchedNutrition.data.product.product_name,
      ["serving size"]: { value: 100, unit: "g" },
      nutrition: nutriments,
      barcodeNumber,
    });
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not fetch nutritional data" } })
      .status(404);
  }
};

const scanBarcodeImage = async (req, res) => {
  try {
    const { barcodeImageFile } = req.files;
    return res.json(await scanBarcodeImageAsync(barcodeImageFile.data));
  } catch (err) {
    console.log(err);
    return res
      .json({ error: { message: "Could not scan barcode" } })
      .status(404);
  }
};

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
      .json({ error: { message: "Could not fetch nutritional data" } })
      .status(404);
  }
};

module.exports = {
  getNutritionFromBarcodeNumber,
  scanBarcodeImage,
  getFoodsFromQuery,
};
