const express = require("express");
const router = express.Router();
const {
  getProfileData,
  getProfilePicture,
  createUser,
  postProfileData,
  postProfilePicture
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

router.post(
  "/profile/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  postProfileData
);

router.post(
  "/profilePicture/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  postProfilePicture
);

module.exports = router;
