const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

router.post(
    "/signUp/:userUID",
    isAuthenticated,
    isAuthorized(PRIVATE),
    createUser
);

module.exports = router;
