const config = require("../config/config");
const { AssetUtils, RequestUtils } = require("../utils");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

const getAsset = (req, res) => {
    try {
        const { assetName } = req.params;

        const assetURL = config.ASSETS.URL[assetName.toUpperCase()];

        if (!AssetUtils.urlExists(assetURL))
            throw new RequestUtils.RequestError(
                `Could not retrieve url for the "${assetName}" asset.`,
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE
            );

        res.json({ assetURL });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

module.exports = { getAsset };
