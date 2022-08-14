import {
  INITIALIZE_USER,
  RESET_USER,
  SET_AUTHENTICATING_USER,
  SET_USER_FIREBASE_DATA,
  SET_VERIFICATION_STATUS,
} from "./userTypes";

export const initializeUser = () => {
  return { type: INITIALIZE_USER };
};

export const resetUser = () => {
  return { type: RESET_USER };
};

export const setUserFirebaseData = (user) => {
  return { type: SET_USER_FIREBASE_DATA, payload: user };
};

export const setAuthenticatingUser = (isAuthenticating) => {
  return { type: SET_AUTHENTICATING_USER, payload: isAuthenticating };
};
export const setVerificationStatus = (verificationStatus) => {
  return { type: SET_VERIFICATION_STATUS, payload: verificationStatus };
};
