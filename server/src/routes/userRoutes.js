const express = require("express");
const router = express.Router();
const {
  getProfilePicture,
  createUser,
} = require("../controllers/userController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/profilePicture/:userUID", getProfilePicture);

router.post("/signup", isAuthenticated, isAuthorized(PRIVATE), createUser);

module.exports = router;
