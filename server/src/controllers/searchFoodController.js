const {
  scanBarcodeImageAsync,
} = require("../services/cloudmersive/cloudmersive");
const axios = require("axios");
const config = require("../config/config");

const getNutritionFromBarcodeNumber = async (req, res) => {
  const { barcodeNumber } = req.params;
  const nutrition = await axios.get(
    `https://world.openfoodfacts.org/api/v0/product/${barcodeNumber}.json`
  );

  const nutriments = Object.fromEntries(
    Object.entries(nutrition.data.product.nutriments)
      .filter(([key]) => key.endsWith("_100g") && key !== "energy_100g")
      .map(([key, value]) =>
        key === "energy-kcal_100g"
          ? ["calories", value]
          : [key.replace("_100g", ""), { value, unit: "g" }]
      )
      .concat([["servingSize", { value: 100, unit: "g" }]])
  );

  const clean = {
    name: nutrition.data.product.product_name,
    nutrition: nutriments,
    barcodeNumber,
  };
  return res.json(clean);
};

const scanBarcodeImage = async (req, res) => {
  const { barcodeImageFile } = req.files;
  const response = await scanBarcodeImageAsync(barcodeImageFile.data);
  return res.json(response);
};

const getNutritionFromName = async (req, res) => {
  const { name } = req.params;

  const api_params = {
    api_key: config.FOOD_DATA_CENTRAL_API_KEY,
    query: name,
    pageNumber: 1,
    dataType: ["Survey (FNDDS)"],
    pageSize: 200,
    requireAllWords: true,
  };

  let api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?`;

  Object.entries(api_params).forEach(([key, value], index) => {
    api_url += `${index === 0 ? "" : "&"}${key}=${value}`;
  });

  const nutrition = await axios.get(api_url);

  return res.json(nutrition.data);
};

module.exports = {
  getNutritionFromBarcodeNumber,
  scanBarcodeImage,
  getNutritionFromName,
};
