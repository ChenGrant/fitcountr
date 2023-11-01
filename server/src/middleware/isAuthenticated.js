const admin = require("firebase-admin");
const { RequestUtils, FirebaseUtils, AuthUtils } = require("../utils");
const auth = admin.auth();

const isAuthenticated = async (req, res, next) => {
    try {
        const idToken = req.headers.authorization;

        const user = await auth.verifyIdToken(idToken);

        req.headerAuthUserUID = user.uid;

        next();
    } catch (err) {
        if (
            err.message === FirebaseUtils.FIREBASE_ID_TOKEN_FAILED_ERROR_MESSAGE
        )
            err.message = AuthUtils.AUTHENTICATION_FAILED_ERROR_MESSAGE;

        RequestUtils.sendErrorResponse(res, err.message, {
            [AuthUtils.AUTHENTICATION_FAILED_ERROR_MESSAGE]:
                RequestUtils.UNAUTHORIZED_STATUS_CODE,
        });
    }
};

module.exports = isAuthenticated;
