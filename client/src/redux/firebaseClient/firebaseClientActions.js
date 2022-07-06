import {
  INITIALIZED_FIREBASE_CLIENT,
  INITIALIZED_FIREBASE_AUTH,
} from "./firebaseClientTypes";

export const initializedFirebaseClient = () => {
  return {
    type: INITIALIZED_FIREBASE_CLIENT,
  };
};

export const initializedFirebaseAuth = (auth) => {
  return {
    type: INITIALIZED_FIREBASE_AUTH,
    payload: auth,
  };
};
