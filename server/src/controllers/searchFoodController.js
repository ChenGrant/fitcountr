const {
  scanBarcodeImageAsync,
} = require("../services/cloudmersive/cloudmersive");
const axios = require("axios");

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

  console.log(nutriments)

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

module.exports = { getNutritionFromBarcode, scanBarcode };
