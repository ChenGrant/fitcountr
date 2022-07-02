const express = require("express");
const router = express.Router();
const {
  getFirebaseClientConfig,
} = require("../controllers/firebaseClientConfigController");

router.get("/", getFirebaseClientConfig);

module.exports = router;
