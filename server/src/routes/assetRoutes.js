const express = require("express");
const router = express.Router();
const { getAsset } = require("../controllers/assetController");

// handles a GET request that contains the name of an asset file.
// responds with the url of that requested asset
router.get("/:assetName", getAsset);

module.exports = router;
