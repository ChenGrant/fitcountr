const config = require("../config/config");

// ----------------------------- getFirebaseClientConfig -----------------------------
const getFirebaseClientConfig = (req, res) => {
  try {
    // get the firebase client configuration object
    res.json(config.FIREBASE_CLIENT_CONFIG);
  } catch (err) {
    console.log(err);
    res.json({
      error: { message: "Could not get Firebase client configuration object" },
    }).status(404);
  }
};

module.exports = { getFirebaseClientConfig };
