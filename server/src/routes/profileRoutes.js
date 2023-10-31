const express = require("express");
const router = express.Router();
const {
    getProfilePicture,
    postProfileData,
    postProfilePicture,
    getProfileData,
} = require("../controllers/profileController");
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

module.exports = router;
