const config = require("../config/config");
const { RequestUtils } = require("../utils");

const { INTERNAL_SERVER_ERROR_CODE } = RequestUtils;

// ----------------------------- getFirebaseClientConfig -----------------------------
const getFirebaseClientConfig = (req, res) => {
  try {
    // get the firebase client configuration object
    res.json(config.FIREBASE_CLIENT_CONFIG);
  } catch (err) {
    console.log(err);
    res
      .json({
        error: {
          message: "Could not get Firebase client configuration object",
        },
      })
      .status(INTERNAL_SERVER_ERROR_CODE);
  }
};

module.exports = { getFirebaseClientConfig };
