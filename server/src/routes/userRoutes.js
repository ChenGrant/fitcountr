const express = require("express");
const router = express.Router();
const {
  getProfileData,
  getProfilePicture,
  getGoals,
  getProgress,
  createUser,
  postProfileData,
  postProfilePicture,
  postProgress,
  postGoal,
  editProgress,
  deleteProgress
} = require("../controllers/userController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/:userUID", isAuthenticated, isAuthorized(PRIVATE), getProfileData);

router.get("/goals/:userUID", isAuthenticated, isAuthorized(PRIVATE), getGoals);

router.get(
  "/profilePicture/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  getProfilePicture
);

router.get(
  "/progress/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  getProgress
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

router.put(
  "/progress/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  editProgress
);

router.delete(
  "/progress/:userUID",
  isAuthenticated,
  isAuthorized(PRIVATE),
  deleteProgress
);
module.exports = router;
