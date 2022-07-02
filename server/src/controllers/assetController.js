const config = require("../config/config");
const assert = require("assert");

const getAsset = (req, res) => {
  try {
    const { assetName } = req.params;
    const assetURL = config.ASSETS[assetName.toUpperCase()];
    assert(assetURL);
    res.json({ assetURL });
  } catch (err) {
    res.json({ message: "Asset not found" });
  }
};

module.exports = { getAsset };
