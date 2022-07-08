const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/signupController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

// handles a POST request containing user information and the email verification
// provider.
// creates a document for the user in the 'users' collection.
router.post("/", isAuthenticated, isAuthorized(PRIVATE), createUser);

module.exports = router;
