const ASSET_URL_DOES_NOT_EXIST_ERROR_MESSAGE =
    "Asset url does not exist.";

const assertAssetUrlExists = (assetURL) => {
    if (assetURL === undefined)
        throw new Error(ASSET_URL_DOES_NOT_EXIST_ERROR_MESSAGE);
};

module.exports = {
    ASSET_URL_DOES_NOT_EXIST_ERROR_MESSAGE,
    assertAssetUrlExists,
};
