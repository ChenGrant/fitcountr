import {
  INITIALIZE_FIREBASE_CLIENT,
  INITIALIZE_FIREBASE_AUTH,
} from "./firebaseClientTypes";

export const initializeFirebaseClient = () => {
  return {
    type: INITIALIZE_FIREBASE_CLIENT,
  };
};

export const initializeFirebaseAuth = (auth) => {
  return {
    type: INITIALIZE_FIREBASE_AUTH,
    payload: auth,
  };
};
