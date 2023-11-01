const User = require("../models/User");
const { RequestUtils, AuthUtils } = require("../utils");

const ADMIN = "ADMIN";
const PRIVATE = "PRIVATE";
const PUBLIC = "PUBLIC";

const isAuthorized = (privacyStatus = PUBLIC) => {
    return async (req, res, next) => {
        try {
            const { userUID } = req.params;

            if (await User.isAdmin(userUID)) return next();

            if (privacyStatus === PRIVATE && req.headerAuthUserUID === userUID)
                return next();

            if (privacyStatus === PUBLIC) return next();

            throw new Error(AuthUtils.AUTHORIZATION_FAILED_ERROR_MESSAGE);
        } catch (err) {
            RequestUtils.sendErrorResponse(res, err.message, {
                [AuthUtils.AUTHORIZATION_FAILED_ERROR_MESSAGE]:
                    RequestUtils.FORBIDDEN_STATUS_CODE,
            });
        }
    };
};

module.exports = { isAuthorized, ADMIN, PRIVATE, PUBLIC };
