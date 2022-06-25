const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `..\\env\\${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_CLIENT_CONFIG : {
    apiKey: process.env.FIREBASE_CLIENT_CONFIG_API_KEY,
    authDomain: process.env.FIREBASE_CLIENT_CONFIG_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_CLIENT_CONFIG_PROJECT_ID,
    storageBucket: process.env.FIREBASE_CLIENT_CONFIG_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_CLIENT_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_CLIENT_CONFIG_APP_ID,
  },
};
