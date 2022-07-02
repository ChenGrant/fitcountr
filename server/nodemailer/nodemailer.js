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

const sendMailAsync = ({ from = GMAIL_USERNAME, to, subject, text }) => {
  return new Promise((res, rej) => {
    transport.sendMail(
      {
        from,
        to,
        subject,
        text,
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
    text: emailVerificationCode.toString(),
  });
};

module.exports = {
  sendEmailVerificationAsync,
};
