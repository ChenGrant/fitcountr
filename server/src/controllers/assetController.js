const config = require("../config/config");
const { AssetUtils, RequestUtils } = require("../utils");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

const getAsset = (req, res) => {
    try {
        const { assetName } = req.params;

        const assetURL = config.ASSETS.URL[assetName.toUpperCase()];

        AssetUtils.assertAssetUrlExists(assetURL);

        res.json({ assetURL });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [AssetUtils.ASSET_URL_DOES_NOT_EXIST_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

module.exports = { getAsset };
