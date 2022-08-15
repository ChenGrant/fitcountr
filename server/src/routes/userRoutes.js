const express = require("express");
const router = express.Router();
const {
  getProfileData,
  getProfilePicture,
  createUser,
} = require("../controllers/userController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get(
  "/profile/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  getProfileData
);

router.get(
  "/profilePicture/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  getProfilePicture
);

router.post(
  "/signup/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  createUser
);

module.exports = router;
