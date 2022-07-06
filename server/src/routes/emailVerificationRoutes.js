const express = require("express");
const router = express.Router();
const {
  verifyEmail,
  sendVerificationEmail,
} = require("../controllers/emailVerificationController");

// handles a POST request containing an email and an email verification pin.
// responds with the verification status of the email or possible the number of
// digits in the email verification pin.
router.post("/verify", verifyEmail);

// handles a POST request containing an email.
// sends a verification email containing the email verification pin to the email.
router.post("/send", sendVerificationEmail);

module.exports = router;
