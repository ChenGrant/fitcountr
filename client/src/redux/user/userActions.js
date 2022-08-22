import {
  INITIALIZE_USER,
  RESET_USER,
  SET_AUTHENTICATING_USER,
  SET_USER_PROFILE,
  SET_USER_FIREBASE_DATA,
  SET_USER_PROFILE_PICTURE_IS_LOADING,
  SET_USER_PROFILE_PICTURE_URL,
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

export const setUserProfilePictureURL = (profilePictureURL) => ({
  type: SET_USER_PROFILE_PICTURE_URL,
  payload: profilePictureURL,
});

export const setUserProfilePictureIsLoading = (loadingState) => ({
  type: SET_USER_PROFILE_PICTURE_IS_LOADING,
  payload: loadingState,
});

export const setUserProfile = (profile) => ({
  type: SET_USER_PROFILE,
  payload: profile,
});
