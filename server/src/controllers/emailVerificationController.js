const User = require("../models/User");
const EmailService = require("../services/emailService");
const UserService = require("../services/userService");
const { NumberUtils, RequestUtils } = require("../utils/index");

const getEmailIsInUse = async (req, res) => {
    try {
        const { email } = req.params;

        EmailService.assertEmailIsProvided(email);

        const emailIsInUse = await User.emailIsInUse(email);

        return res.json({ emailIsInUse });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailService.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
        });
    }
};

const getEmailVerificationPinLength = async (req, res) => {
    try {
        const { email } = req.params;

        EmailService.assertEmailIsProvided(email);

        await EmailService.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const emailVerificationPinLength = NumberUtils.getIntMagnitudeLength(
            user.emailVerification.pin
        );

        return res.json({ pinLength: emailVerificationPinLength });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailService.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const getEmailVerificationProvider = async (req, res) => {
    try {
        const { email } = req.params;

        EmailService.assertEmailIsProvided(email);

        await EmailService.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const emailProvider = user.emailVerification.provider;

        return res.json({ emailProvider });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailService.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const getEmailVerificationStatus = async (req, res) => {
    try {
        const { email } = req.params;

        EmailService.assertEmailIsProvided(email);

        await EmailService.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const verificationStatus = user.emailVerification.isVerified
            ? EmailService.EMAIL_IS_VERIFIED
            : EmailService.EMAIL_IS_NOT_VERIFIED;

        return res.json({ verificationStatus });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailService.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
        });
    }
};

const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.params;

        EmailService.assertEmailIsProvided(email);

        await EmailService.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const verificationEmailOptions =
            EmailService.getVerificationEmailOptions(
                user.email,
                user.emailVerification.pin
            );

        await EmailService.sendEmail(verificationEmailOptions);

        return res.json({ message: "Verification email sent" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailService.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
            [EmailService.NO_EMAIL_IS_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
        });
    }
};

const validateEmailVerificationPin = async (req, res) => {
    try {
        const { email, pin } = req.body;

        EmailService.assertEmailVerificationPinIsProvided(pin);

        EmailService.assertEmailIsProvided(email);

        await EmailService.assertEmailIsInUse(email);

        const user = await User.findUserByEmail(email);

        const pinIsValid = user.emailVerification.pin === pin;

        if (pinIsValid)
            await UserService.updateUserIsVerified(user, pinIsValid);

        const responseMessage = pinIsValid ? "Pin is valid" : "Pin is invalid";

        return res.json({ message: responseMessage });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err.message, {
            [EmailService.EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE]:
                RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE,
            [EmailService.NO_EMAIL_VERIFICATION_PIN_PROVIDED_ERROR_MESSAGE]:
                RequestUtils.BAD_REQUEST_STATUS_CODE,
            [EmailService.NO_EMAIL_IS_PROVIDED_ERROR_MESSAGE]:
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
