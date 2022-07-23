const {
  scanBarcodeImageAsync,
} = require("../services/cloudmersive/cloudmersive");
const axios = require("axios");
const config = require("../config/config");

const getNutritionFromBarcode = async (req, res) => {
  const { barcode } = req.params;
  const nutrition = await axios.get(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );
  console.log(nutrition);

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

  console.log(nutriments);

  const clean = {
    name: nutrition.data.product.product_name,
    nutrition: nutriments,
    barcode,
  };
  return res.json(clean);
};

const scanBarcode = async (req, res) => {
  const { barcodeImageFile } = req.files;
  const response = await scanBarcodeImageAsync(barcodeImageFile.data);
  return res.json(response);
};

const getNutritionFromName = async (req, res) => {
  const { name } = req.params;

  const api_params = {
    api_key: config.FOOD_DATA_CENTRAL_API_KEY,
    query: name,
    pageNumber: 2,
    dataType: ["Branded"],
    brandName: "Liberte",
    pageSize: 200,
  };

  let api_url = `https://api.nal.usda.gov/fdc/v1/foods/search?`;

  Object.entries(api_params).forEach(([key, value]) => {
    api_url += `${key}=${value}&`;
  });
  console.log(api_url);

  // api_key=${config.FOOD_DATA_CENTRAL_API_KEY}&query=${name}`;

  const nutrition = await axios.get(api_url);
  console.log(nutrition);
  return res.json(nutrition.data);
};

module.exports = { getNutritionFromBarcode, getNutritionFromName, scanBarcode };
