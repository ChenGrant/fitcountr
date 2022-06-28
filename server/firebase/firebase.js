const admin = require("firebase-admin");
const config = require("../config/config");

admin.initializeApp({
  credential: admin.credential.cert(config.FIREBASE_ADMIN_CREDENTIALS),
});
