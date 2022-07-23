const express = require("express");
const router = express.Router();
const {
  getNutritionFromBarcode,
  scanBarcode,
  getNutritionFromName,
} = require("../controllers/searchFoodController");

router.get("/barcode/:barcode", getNutritionFromBarcode);
router.get("/name/:name", getNutritionFromName);
router.post("/scanBarcode", scanBarcode);

module.exports = router;
