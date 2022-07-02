const config = require("../config/config");

const getFirebaseClientConfig = (req, res) => {
  res.json(config.FIREBASE_CLIENT_CONFIG);
};

module.exports = { getFirebaseClientConfig };
