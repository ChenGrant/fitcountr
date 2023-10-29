const express = require("express");
const router = express.Router();
const { getAsset } = require("../controllers/assetController");

// -------------------------------------- ROUTES --------------------------------------

router.get("/:assetName", getAsset);

module.exports = router;
