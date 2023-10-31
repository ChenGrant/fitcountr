const express = require("express");
const router = express.Router();
const {
    getFoods,
    postFood,
    deleteFood,
} = require("../controllers/foodsController");
const { isAuthorized, PRIVATE } = require("../middleware/isAuthorized");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/:userUID", isAuthenticated, isAuthorized(PRIVATE), getFoods);

router.post("/:userUID", isAuthenticated, isAuthorized(PRIVATE), postFood);

router.delete("/:userUID", isAuthenticated, isAuthorized(PRIVATE), deleteFood);

module.exports = router;
