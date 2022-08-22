const express = require("express");
const router = express.Router();
const {
  getProfileData,
  getProfilePicture,
  createUser,
  postProfileData,
  postProfilePicture,
  postProgress,
  postGoal,
} = require("../controllers/userController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/:userUID", isAuthenticated, isAuthorized(PRIVATE), getProfileData);

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
  "/:userUID",
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

router.post(
  "/progress/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  postProgress
);

router.post("/goal/:userUID", isAuthenticated, isAuthorized(PRIVATE), postGoal);

module.exports = router;
