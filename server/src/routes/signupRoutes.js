const express = require("express");
const router = express.Router();
const {
  createUser,
  verifyEmail,
  sendVerificationEmail,
} = require("../controllers/signupController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/", isAuthenticated, isAuthorized(PRIVATE), createUser);

router.post("/emailverification", verifyEmail);

router.post("/emailverification/send", sendVerificationEmail);

module.exports = router;
