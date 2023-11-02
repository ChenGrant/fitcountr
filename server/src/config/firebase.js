const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");

const initializeFirebaseAdminSDK = () => {
    admin.initializeApp({
        credential: admin.credential.cert({
            type: process.env.FIREBASE_ADMIN_CREDENTIALS_TYPE,
            project_id: process.env.FIREBASE_ADMIN_CREDENTIALS_PROJECT_ID,
            private_key_id:
                process.env.FIREBASE_ADMIN_CREDENTIALS_PRIVATE_KEY_ID,
            private_key:
                process.env.FIREBASE_ADMIN_CREDENTIALS_PRIVATE_KEY.replace(
                    /\\n/g,
                    "\n"
                ),
            client_email: process.env.FIREBASE_ADMIN_CREDENTIALS_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_ADMIN_CREDENTIALS_CLIENT_ID,
            auth_uri: process.env.FIREBASE_ADMIN_CREDENTIALS_AUTH_URI,
            token_uri: process.env.FIREBASE_ADMIN_CREDENTIALS_TOKEN_URI,
            auth_provider_x509_cert_url:
                process.env
                    .FIREBASE_ADMIN_CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
            client_x509_cert_url:
                process.env.FIREBASE_ADMIN_CREDENTIALS_CLIENT_X509_CERT_URL,
        }),
        storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
    });
};

const getFirebaseAuth = () => admin.auth();

const getFirebaseStorageBucket = () => getStorage().bucket();

module.exports = {
    initializeFirebaseAdminSDK,
    getFirebaseStorageBucket,
    getFirebaseAuth,
};
