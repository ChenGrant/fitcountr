const config = require("../config/config");
const { RequestUtils } = require("../utils");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************
const getFirebaseClientConfig = (req, res) => {
    try {
        const firebaseClientConfigObject = config.FIREBASE_CLIENT_CONFIG;
        res.json(firebaseClientConfigObject);
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

module.exports = { getFirebaseClientConfig };
