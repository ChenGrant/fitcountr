const express = require("express");
const router = express.Router();
const {
  createUser,
  verifyEmail,
  sendVerificationEmail,
} = require("../controllers/signupController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

// handles a POST request containing user information.
// creates a document for the user in the 'users' collection.
router.post("/", isAuthenticated, isAuthorized(PRIVATE), createUser);

// handles a POST request containing an email and an email verification pin.
// responds with the verification status of the email or possible the number of
// digits in the email verification pin.
router.post("/emailverification", verifyEmail);

// handles a POST request containing an email.
// sends a verification email containing the email verification pin to the email.
router.post("/emailverification/send", sendVerificationEmail);

module.exports = router;
