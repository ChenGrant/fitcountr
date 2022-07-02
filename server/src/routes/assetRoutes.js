const express = require("express");
const router = express.Router();
const { getAsset } = require("../controllers/assetController");

router.get("/:assetName", getAsset);

module.exports = router;
