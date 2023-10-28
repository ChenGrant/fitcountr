const User = require("../models/User");
const { emailUtils, NumberUtils, RequestUtils } = require("../utils/index");

// ************************************************************************************
// --------------------------------- HELPER FUNCTIONS ---------------------------------
// ************************************************************************************

const throwRequestErrorIfEmailIsNotInUse = async (email) => {
    if (!(await User.emailIsInUse(email)))
        throw new RequestUtils.RequestError(
            `The email ${email} does not exist.`,
            RequestUtils.RESOURCE_NOT_FOUND_STATUS_CODE
        );
};

// ************************************************************************************
// ----------------------------------- CONTROLLERS ------------------------------------
// ************************************************************************************

const getEmailIsInUse = async (req, res) => {
    try {
        const { email } = req.params;

        const emailIsInUse = await User.emailIsInUse(email);

        return res.json({ emailIsInUse });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

const getEmailVerificationPinLength = async (req, res) => {
    try {
        const { email } = req.params;

        await throwRequestErrorIfEmailIsNotInUse(email);

        const user = await User.findUserByEmail(email);

        const emailVerificationPinLength = NumberUtils.getIntMagnitudeLength(
            user.emailVerification.pin
        );

        return res.json({ pinLength: emailVerificationPinLength });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

const getEmailVerificationProvider = async (req, res) => {
    try {
        const { email } = req.params;

        await throwRequestErrorIfEmailIsNotInUse(email);

        const user = await User.findUserByEmail(email);

        const emailProvider = user.emailVerification.provider;

        return res.json({ emailProvider });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

const getVerificationStatus = async (req, res) => {
    try {
        const { email } = req.params;

        await throwRequestErrorIfEmailIsNotInUse(email);

        const user = await User.findUserByEmail(email);

        const verificationStatus = user.emailVerification.isVerified
            ? emailUtils.EMAIL_IS_VERIFIED
            : emailUtils.EMAIL_IS_NOT_VERIFIED;

        return res.json({ verificationStatus });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.params;

        await throwRequestErrorIfEmailIsNotInUse(email);

        const user = await User.findUserByEmail(email);

        const verificationEmailOptions = emailUtils.getVerificationEmailOptions(
            user.email,
            user.emailVerification.pin
        );

        const sendEmailResponse = await emailUtils.sendEmail(
            verificationEmailOptions
        );

        if (!sendEmailResponse.success)
            throw new RequestUtils.RequestError(
                `Could not send verification email to ${user.email}.`
            );

        return res.json({ message: "Verification email sent" });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

const validatePin = async (req, res) => {
    try {
        const { email, pin } = req.body;

        if (!pin)
            throw new RequestUtils.RequestError(
                `No email verification pin provided.`,
                RequestUtils.BAD_REQUEST_STATUS_CODE
            );

        await throwRequestErrorIfEmailIsNotInUse(email);

        const user = await User.findUserByEmail(email);

        const requestPinIsValid = user.emailVerification.pin === pin;

        if (requestPinIsValid) {
            user.emailVerification.isVerified = true;
            await user.save();
        }

        const responseMessage = requestPinIsValid
            ? "Pin is valid"
            : "Pin is invalid";

        return res.json({ message: responseMessage });
    } catch (err) {
        RequestUtils.sendErrorResponse(res, err);
    }
};

module.exports = {
    getEmailIsInUse,
    getEmailVerificationPinLength,
    getEmailVerificationProvider,
    getVerificationStatus,
    sendVerificationEmail,
    validatePin,
};
