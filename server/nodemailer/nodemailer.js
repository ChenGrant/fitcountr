const config = require("../config/config");
const nodemailer = require("nodemailer");

const GMAIL_USERNAME = config.NODEMAILER.GMAIL_USERNAME;
const GMAIL_PASSWORD = config.NODEMAILER.GMAIL_PASSWORD;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASSWORD,
  },
});

const sendMailAsync = ({ from = GMAIL_USERNAME, ...rest }) => {
  return new Promise((res, rej) => {
    transport.sendMail(
      {
        from,
        ...rest,
      },
      (err, data) => {
        if (err) {
          err && rej(err);
          return;
        }
        res(data);
      }
    );
  });
};

const sendEmailVerificationAsync = async (
  receiverEmail,
  emailVerificationCode
) => {
  await sendMailAsync({
    to: receiverEmail,
    subject: "Email Verification fitcountr",
    html: `<p>Hi</h1>
    <br>
    <p>To complete the signup process, please verify your email with the following code.</p>
    <a href = '${config.WEBSITE}emailverification/${receiverEmail}'>Click here to verify email</a>
    <p><b>Code: ${emailVerificationCode.toString()}</b></p>
    <br>
    <p>Best regards,</p>
    <p>fitcountr</p>`,
  });
};

module.exports = {
  sendEmailVerificationAsync,
};
