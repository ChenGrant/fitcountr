const express = require("express");
const router = express.Router();
const {
  getNutritionFromBarcodeNumber,
  scanBarcodeImage,
  getFoodsFromQuery,
} = require("../controllers/searchFoodController");

router.get("/barcodeNumber/:barcodeNumber", getNutritionFromBarcodeNumber);
router.get("/query/:query/:pageNumber/:pageSize", getFoodsFromQuery);
router.post("/scanBarcodeImage", scanBarcodeImage);

module.exports = router;
