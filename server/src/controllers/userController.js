const UserService = require("../services/userService");
const { RequestUtils } = require("../utils");

const createUser = async (req, res) => {
    try {
        const { email, provider } = req.body;
        const { userUID } = req.params;

        UserService.assertProviderIsProvided(provider);

        await UserService.assertUserIdIsInFirebase(userUID);

        await UserService.assertEmailIsInFirebase(email);

        await UserService.createUserWithProvider(email, userUID, provider);

        return res.json({ userIsCreated: true });
    } catch (err) {
        console.log(err)
        RequestUtils.sendErrorResponse(res, err.message, {
            [UserService.NO_PROVIDER_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [UserService.EMAIL_ALREADY_IN_USE_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [UserService.NO_PROVIDER_MATCHED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
        });
    }
};

module.exports = {
    createUser,
};
