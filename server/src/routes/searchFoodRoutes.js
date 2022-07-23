const express = require("express");
const router = express.Router();
const {
  getNutritionFromBarcodeNumber,
  scanBarcodeImage,
  getNutritionFromName,
} = require("../controllers/searchFoodController");

router.get("/barcodeNumber/:barcodeNumber", getNutritionFromBarcodeNumber);
router.get("/name/:name", getNutritionFromName);
router.post("/scanBarcodeImage", scanBarcodeImage);

module.exports = router;
