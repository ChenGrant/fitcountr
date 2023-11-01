const express = require("express");
const router = express.Router();
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");
const { getGoals, postGoal } = require("../controllers/goalsController");

router.get("/:userUID", isAuthenticated, isAuthorized(PRIVATE), getGoals);

router.post("/:userUID", isAuthenticated, isAuthorized(PRIVATE), postGoal);

module.exports = router;
