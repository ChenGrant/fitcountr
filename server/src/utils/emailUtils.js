const config = require("../config/config");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ************************************************************************************
// --------------------------------- ERROR MESSAGES ----------------------------------
// ************************************************************************************

const EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE = "Email is not in use.";
const NO_EMAIL_VERIFICATION_PIN_PROVIDED_ERROR_MESSAGE =
    "No email verification pin provided.";
const NO_EMAIL_IS_PROVIDED_ERROR_MESSAGE = "Email is not provided.";

// ************************************************************************************
// ------------------------------------ CONSTANTS -------------------------------------
// ************************************************************************************
const EMAIL_IS_VERIFIED = "Verified";
const EMAIL_IS_NOT_VERIFIED = "Not verified";
const GMAIL_USERNAME = config.NODEMAILER.GMAIL_USERNAME;
const GMAIL_PASSWORD = config.NODEMAILER.GMAIL_PASSWORD;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: GMAIL_USERNAME,
        pass: GMAIL_PASSWORD,
    },
});

// ************************************************************************************
// -------------------------------- ASSERT FUNCTIONS ---------------------------------
// ************************************************************************************

const assertEmailIsInUse = async (email) => {
    if (!(await User.emailIsInUse(email)))
        throw new Error(EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE);
};

const assertEmailIsProvided = (email) => {
    if (!email) throw new Error(NO_EMAIL_IS_PROVIDED_ERROR_MESSAGE);
};

const assertEmailVerificationPinIsProvided = (pin) => {
    if (!pin) throw new Error(NO_EMAIL_VERIFICATION_PIN_PROVIDED_ERROR_MESSAGE);
};

const sendEmail = async ({ from = GMAIL_USERNAME, ...rest }) => {
    await transport.sendMail({ from, ...rest });
};

const getVerificationEmailOptions = (recipientEmail, emailVerificationPin) => ({
    to: recipientEmail,
    subject: "fitcountr Email Verification",
    html: `<p>Hi,</p>
      <br>
      <p>To complete the signup process, please verify your email with the following pin.</p>
      <a href = '${config.WEBSITE}email-verification/${recipientEmail}' 
      style = '
      display: block;
      width: max-content;
      background: #FF6B00;
      padding: 10px;
      text-align: center;
      text-decoration: none;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      line-height: 25px;
      '>Click here to verify email</a>
      <p><b>Pin: ${emailVerificationPin.toString()}</b></p>
      <br>
      <p>Best regards,</p>
      <p>fitcountr</p>`,
});

module.exports = {
    EMAIL_IS_NOT_IN_USE_ERROR_MESSAGE,
    NO_EMAIL_VERIFICATION_PIN_PROVIDED_ERROR_MESSAGE,
    NO_EMAIL_IS_PROVIDED_ERROR_MESSAGE,
    EMAIL_IS_VERIFIED,
    EMAIL_IS_NOT_VERIFIED,
    assertEmailVerificationPinIsProvided,
    getVerificationEmailOptions,
    sendEmail,
    assertEmailIsProvided,
    assertEmailIsInUse,
};
