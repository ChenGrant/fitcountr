const config = require("../config/config");
const { RequestUtils, FirebaseUtils } = require("../utils");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************
const getFirebaseClientConfig = (req, res) => {
    try {
        const firebaseClientConfigObject = config.FIREBASE_CLIENT_CONFIG;

        FirebaseUtils.assertFirebaseClientConfigObjectExists(
            firebaseClientConfigObject
        );

        res.json(firebaseClientConfigObject);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [FirebaseUtils.FIREBASE_CLIENT_CONFIG_OBJECT_DOES_NOT_EXIST_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

module.exports = { getFirebaseClientConfig };
