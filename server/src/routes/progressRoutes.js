const express = require("express");
const router = express.Router();
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");
const {
    postProgress,
    editProgress,
    deleteProgress,
    getProgress,
} = require("../controllers/progressController");

router.get("/:userUID", isAuthenticated, isAuthorized(PRIVATE), getProgress);

router.post("/:userUID", isAuthenticated, isAuthorized(PRIVATE), postProgress);

router.put("/:userUID", isAuthenticated, isAuthorized(PRIVATE), editProgress);

router.delete(
    "/:userUID",
    isAuthenticated,
    isAuthorized(PRIVATE),
    deleteProgress
);

module.exports = router;
