const config = require("../config/config");

// ----------------------------- getFirebaseClientConfig -----------------------------
const getFirebaseClientConfig = (req, res) => {
  // get the firebase client configuration object
  res.json(config.FIREBASE_CLIENT_CONFIG);
};

module.exports = { getFirebaseClientConfig };
