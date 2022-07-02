const config = require("../../config/config");
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
  emailVerificationPin
) => {
  await sendMailAsync({
    to: receiverEmail,
    subject: "fitcountr Email Verification",
    html: `<p>Hi,</p>
      <br>
      <p>To complete the signup process, please verify your email with the following pin.</p>
      <a href = '${config.WEBSITE}emailverification/${receiverEmail}' 
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
};

module.exports = {
  sendEmailVerificationAsync,
};
