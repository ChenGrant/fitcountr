const config = require("../config/config");
const nodemailer = require("nodemailer");

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

const sendEmail = async ({ from = GMAIL_USERNAME, ...rest }) => {
    try {
        await transport.sendMail({ from, ...rest });
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

module.exports = {
    EMAIL_IS_VERIFIED,
    EMAIL_IS_NOT_VERIFIED,
    getVerificationEmailOptions,
    sendEmail,
};
