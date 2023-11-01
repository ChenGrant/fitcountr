const express = require("express");
const router = express.Router();
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");
const { createUser } = require("../controllers/userController");

router.post(
    "/signUp/:userUID",
    isAuthenticated,
    isAuthorized(PRIVATE),
    createUser
);

module.exports = router;
