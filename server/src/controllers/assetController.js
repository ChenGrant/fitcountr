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
    console.log(err);
    res.json({ error: { message: "Could not retrieve asset" } });
  }
};

module.exports = { getAsset };
