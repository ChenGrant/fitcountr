import {
  INITIALIZE_FIREBASE_CLIENT,
  INITIALIZE_FIREBASE_AUTH,
  SIGN_IN_USER,
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

export const signInUser = (user) => {
  return {
    type: SIGN_IN_USER,
    payload: user,
  };
};
