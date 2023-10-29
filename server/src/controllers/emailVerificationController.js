const User = require("../models/User");
const { EmailUtils, NumberUtils, RequestUtils } = require("../utils/index");

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

const getEmailIsInUse = async (req, res) => {
    try {
        const { email } = req.params;

        EmailUtils.assertEmailIsProvided(email);

        const emailIsInUse = await User.emailIsInUse(email);

        return res.json({ emailIsInUse });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailUtils.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
        });
    }
};

const getEmailVerificationPinLength = async (req, res) => {
    try {
        const { email } = req.params;

        EmailUtils.assertEmailIsProvided(email);

        await EmailUtils.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const emailVerificationPinLength = NumberUtils.getIntMagnitudeLength(
            user.emailVerification.pin
        );

        return res.json({ pinLength: emailVerificationPinLength });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailUtils.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const getEmailVerificationProvider = async (req, res) => {
    try {
        const { email } = req.params;

        EmailUtils.assertEmailIsProvided(email);

        await EmailUtils.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const emailProvider = user.emailVerification.provider;

        return res.json({ emailProvider });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailUtils.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const getEmailVerificationStatus = async (req, res) => {
    try {
        const { email } = req.params;

        EmailUtils.assertEmailIsProvided(email);

        await EmailUtils.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const verificationStatus = user.emailVerification.isVerified
            ? EmailUtils.EMAIL_IS_VERIFIED
            : EmailUtils.EMAIL_IS_NOT_VERIFIED;

        return res.json({ verificationStatus });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailUtils.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.params;

        EmailUtils.assertEmailIsProvided(email);

        await EmailUtils.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const verificationEmailOptions = EmailUtils.getVerificationEmailOptions(
            user.email,
            user.emailVerification.pin
        );

        await EmailUtils.sendEmail(verificationEmailOptions);

        return res.json({ message: "Verification email sent" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailUtils.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
            [EmailUtils.NO_EMAIL_IS_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
        });
    }
};

const validateEmailVerificationPin = async (req, res) => {
    try {
        const { email, pin } = req.body;

        EmailUtils.assertEmailVerificationPinIsProvided(pin);

        EmailUtils.assertEmailIsProvided(email);

        await EmailUtils.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const pinIsValid = user.emailVerification.pin === pin;

        await User.setUserIsVerified(user, pinIsValid);

        const responseMessage = pinIsValid ? "Pin is valid" : "Pin is invalid";

        return res.json({ message: responseMessage });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailUtils.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
            [EmailUtils.NO_EMAIL_VERIFICATION_PIN_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [EmailUtils.NO_EMAIL_IS_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
        });
    }
};

module.exports = {
    getEmailIsInUse,
    getEmailVerificationPinLength,
    getEmailVerificationProvider,
    getEmailVerificationStatus,
    sendVerificationEmail,
    validateEmailVerificationPin,
};
