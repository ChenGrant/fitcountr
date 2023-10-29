const express = require("express");
const router = express.Router();
const {
    getEmailIsInUse,
    getEmailVerificationStatus,
    getEmailVerificationProvider,
    getEmailVerificationPinLength,
    validateEmailVerificationPin,
    sendVerificationEmail,
} = require("../controllers/emailVerificationController");

// -------------------------------------- ROUTES --------------------------------------

router.get("/emailIsInUse/:email", getEmailIsInUse);

router.get("/provider/:email", getEmailVerificationProvider);

router.get("/pinLength/:email", getEmailVerificationPinLength);

router.get("/verificationStatus/:email", getEmailVerificationStatus);

router.post("/sendVerificationEmail/:email", sendVerificationEmail);

router.post("/validatePin", validateEmailVerificationPin);

module.exports = router;
