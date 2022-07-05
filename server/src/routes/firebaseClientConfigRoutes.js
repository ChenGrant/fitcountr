const express = require("express");
const router = express.Router();
const {
  getFirebaseClientConfig,
} = require("../controllers/firebaseClientConfigController");

// responds with the Firebase client configuration object
router.get("/", getFirebaseClientConfig);

module.exports = router;
