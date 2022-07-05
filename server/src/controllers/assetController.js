const config = require("../config/config");
const assert = require("assert");

// ------------------------------------- getAsset -------------------------------------
const getAsset = (req, res) => {
  try {
    const { assetName } = req.params;
    const assetURL = config.ASSETS[assetName.toUpperCase()];
    // verify that there exists an assert with a name of assetName
    assert(assetURL);
    res.json({ assetURL });
  } catch (err) {
    res.json({ message: "Could not retrieve asset" });
  }
};

module.exports = { getAsset };
