const FIREBASE_CLIENT_CONFIG_OBJECT_DOES_NOT_EXIST_ERROR_MESSAGE =
    "Firebase client config object does not exist.";

const assertFirebaseClientConfigObjectExists = (firebaseClientConfigObject) => {
    if (firebaseClientConfigObject) return;
    throw new Error(FIREBASE_CLIENT_CONFIG_OBJECT_DOES_NOT_EXIST_ERROR_MESSAGE);
};

module.exports = {
    FIREBASE_CLIENT_CONFIG_OBJECT_DOES_NOT_EXIST_ERROR_MESSAGE,
    assertFirebaseClientConfigObjectExists,
};
