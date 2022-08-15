const express = require("express");
const router = express.Router();
const { getProfilePicture } = require("../controllers/userController");

router.get("/profilePicture/:userUID", getProfilePicture);

module.exports = router;
