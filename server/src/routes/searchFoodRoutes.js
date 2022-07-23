const express = require("express");
const router = express.Router();
const { getNutritionFromBarcode, scanBarcode } = require("../controllers/searchFoodController");

router.get("/nutrition/:barcode", getNutritionFromBarcode);
router.post("/scanBarcode", scanBarcode);

module.exports = router;
