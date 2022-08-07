const {
  scanBarcodeImageCloudmersive,
} = require("../services/cloudmersive/cloudmersive");
const {
  fetchFoodsFromQueryFoodDataCentral,
} = require("../services/foodDataCentral/foodDataCentral");
const {
  fetchFoodFromBarcodeNumberOpenFoodFacts,
} = require("../services/openFoodFacts/openFoodFact");
const { UNITS } = require("../utils/foodUtils");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

// ----------------------------- getFoodFromBarcodeNumber -----------------------------
const getFoodFromBarcodeNumber = async (req, res) => {
  try {
    const { barcodeNumber } = req.params;

    const fetchedFood = await fetchFoodFromBarcodeNumberOpenFoodFacts(
      barcodeNumber
    );

    return res.json({
      name: fetchedFood.data.product.product_name,
      servingSize: { value: 100, unit: UNITS.GRAM },
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
    return res.json(await scanBarcodeImageCloudmersive(barcodeImageFile.data));
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

    const fetchedFoods = await fetchFoodsFromQueryFoodDataCentral({
      query,
      pageNumber,
      dataType: ["Survey (FNDDS)"],
      pageSize,
      requireAllWords: true,
    });

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
