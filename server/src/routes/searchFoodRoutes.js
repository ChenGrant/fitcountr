const express = require("express");
const router = express.Router();
const { postBarcode } = require("../controllers/searchFoodController");

router.post("/barcode", postBarcode);

module.exports = router;
