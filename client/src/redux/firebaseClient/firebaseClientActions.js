import { INITIALIZE_FIREBASE_CLIENT } from "./firebaseClientTypes";

export const initializeFirebaseClient = () => {
  return {
    type: INITIALIZE_FIREBASE_CLIENT,
  };
};
