const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `..\\..\\env\\${process.env.NODE_ENV}.env`),
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  WEBSITE: process.env.WEBSITE,
  MONGODB_ATLAS_URI: process.env.MONGODB_ATLAS_URI,
  FIREBASE_CLIENT_CONFIG: {
    apiKey: process.env.FIREBASE_CLIENT_CONFIG_API_KEY,
    authDomain: process.env.FIREBASE_CLIENT_CONFIG_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_CLIENT_CONFIG_PROJECT_ID,
    storageBucket: process.env.FIREBASE_CLIENT_CONFIG_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_CLIENT_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_CLIENT_CONFIG_APP_ID,
  },
  FIREBASE_ADMIN_CREDENTIALS: {
    type: process.env.FIREBASE_ADMIN_CREDENTIALS_TYPE,
    project_id: process.env.FIREBASE_ADMIN_CREDENTIALS_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_CREDENTIALS_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMIN_CREDENTIALS_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    ),
    client_email: process.env.FIREBASE_ADMIN_CREDENTIALS_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_CREDENTIALS_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMIN_CREDENTIALS_AUTH_URI,
    token_uri: process.env.FIREBASE_ADMIN_CREDENTIALS_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_ADMIN_CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:
      process.env.FIREBASE_ADMIN_CREDENTIALS_CLIENT_X509_CERT_URL,
  },
  NODEMAILER: {
    GMAIL_USERNAME: process.env.NODEMAILER_GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.NODEMAILER_GMAIL_PASSWORD,
  },
  ASSETS: {
    LOGO: process.env.ASSET_LOGO,
    LAPTOP_PHONE: process.env.ASSET_LAPTOP_PHONE,
    EMAIL_DENIED: process.env.ASSET_EMAIL_DENIED,
    EMAIL_PENDING: process.env.ASSET_EMAIL_PENDING,
    EMAIL_VERIFIED: process.env.ASSET_EMAIL_VERIFIED,
  },
};
