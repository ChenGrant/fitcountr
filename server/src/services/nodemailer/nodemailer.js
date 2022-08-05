const config = require("../../config/config");
const nodemailer = require("nodemailer");

const GMAIL_USERNAME = config.NODEMAILER.GMAIL_USERNAME;
const GMAIL_PASSWORD = config.NODEMAILER.GMAIL_PASSWORD;

// create reusable transporter object using the default SMTP transport
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASSWORD,
  },
});

// ------------------------------------- FUNCTIONS -------------------------------------
// sendMailAsync promisifies the transport.sendMail method
const sendMailAsync = ({ from = GMAIL_USERNAME, ...rest }) =>
  new Promise((res, rej) => {
    transport.sendMail({ from, ...rest }, (err, data) => {
      if (err) {
        rej(err);
        return;
      }
      res(data);
    });
  });

// given a receiver email and an email verification pin, sendEmailVerificationAsync
// sends an email to the receiver email that includes the email verification pin and
// a button that redirects them to the /emailverification page on the frontend
const sendEmailVerificationAsync = async (
  receiverEmail,
  emailVerificationPin
) => {
  return await sendMailAsync({
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
