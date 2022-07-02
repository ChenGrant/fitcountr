const express = require("express");
const router = express.Router();
const { createUser, verifyEmail } = require("../controllers/signupController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/", isAuthenticated, isAuthorized(PRIVATE), createUser);

router.post("/emailverification", verifyEmail);

module.exports = router;
