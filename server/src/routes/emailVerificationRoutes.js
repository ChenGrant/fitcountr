const express = require("express");
const router = express.Router();
const {
  getEmailIsInUse,
  getVerificationStatus,
  getEmailVerificationProvider,
  getEmailVerificationPinLength,
  validatePin,
  sendVerificationEmail,
} = require("../controllers/emailVerificationController");

// -------------------------------------- ROUTES --------------------------------------
// handles a GET request containing an email.
// responds with if the email is in use or not
router.get("/emailIsInUse/:email", getEmailIsInUse);

// handles a GET request containing an email.
// responds with the email verification provider for the email
router.get("/provider/:email", getEmailVerificationProvider);

// handles a GET request containing an email.
// responds with the length of the pin associated with the email
router.get("/pinLength/:email", getEmailVerificationPinLength);

// handles a GET request containing an email.
// responds with the verification status of the email
router.get("/verificationStatus/:email", getVerificationStatus);

// handles a POST request containing an email.
// sends a verification email containing the email verification pin to the email.
// responds with if the verification email was sent or not
router.post("/sendVerificationEmail/:email", sendVerificationEmail);

// handles a POST request containing an email and an email verification pin.
// if pin is valid, the verification status of the email is updated
// responds with if the pin is valid or not
router.post("/validatePin", validatePin);

module.exports = router;
