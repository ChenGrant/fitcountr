const { RequestUtils, UserUtils } = require("../utils");

const createUser = async (req, res) => {
    try {
        const { email, provider } = req.body;
        const { userUID } = req.params;

        UserUtils.assertProviderIsProvided(provider);
        await UserUtils.assertUserIdIsInFirebase(userUID);
        await UserUtils.assertEmailIsInFirebase(email);

        await UserUtils.createUserWithProvider(email, userUID, provider);

        return res.json({ userIsCreated: true });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserUtils.NO_PROVIDER_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [UserUtils.EMAIL_ALREADY_IN_USE_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [UserUtils.NO_PROVIDER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
        });
    }
};

module.exports = {
    createUser,
};
