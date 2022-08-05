const express = require("express");
const router = express.Router();
const {
  getFoodFromBarcodeNumber,
  scanBarcodeImage,
  getFoodsFromQuery,
} = require("../controllers/searchFoodController");

router.get("/barcodeNumber/:barcodeNumber", getFoodFromBarcodeNumber);
router.get("/query/:query/:pageNumber/:pageSize", getFoodsFromQuery);
router.post("/scanBarcodeImage", scanBarcodeImage);

module.exports = router;
