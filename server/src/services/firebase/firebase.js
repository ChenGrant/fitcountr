const admin = require("firebase-admin");
const config = require("../../config/config");

// initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(config.FIREBASE_ADMIN_CREDENTIALS),
});
