const express = require("express");
const router = express.Router();
const { scanBarcode } = require("../controllers/searchFoodController");

router.post("/barcode", scanBarcode);

module.exports = router;
