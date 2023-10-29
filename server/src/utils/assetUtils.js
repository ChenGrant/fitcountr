const COULD_NOT_RETRIEVE_ASSET_URL_ERROR_MESSAGE =
    "Could not retrieve asset url.";

const assertAssetUrlExists = (assetURL) => {
    if (assetURL === undefined)
        throw new Error(COULD_NOT_RETRIEVE_ASSET_URL_ERROR_MESSAGE);
};

module.exports = {
    COULD_NOT_RETRIEVE_ASSET_URL_ERROR_MESSAGE,
    assertAssetUrlExists,
};
