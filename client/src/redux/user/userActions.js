import {
  INITIALIZE_USER,
  RESET_USER,
  SET_AUTHENTICATING_USER,
  SET_USER_PROFILE,
  SET_USER_FIREBASE_DATA,
  SET_USER_PROFILE_PICTURE_IS_LOADING,
  SET_USER_PROFILE_PICTURE_URL,
  SET_VERIFICATION_STATUS,
  SET_USER_GOALS,
  SET_USER_PROGRESS,
  ADD_USER_PROGRESS_ITEM,
  REMOVE_USER_PROGRESS_ITEM,
  EDIT_USER_PROGRESS_ITEM,
  SET_USER_FOODS,
  ADD_USER_FOOD,
  REMOVE_USER_FOOD,
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

export const setUserGoals = (goals) => ({
  type: SET_USER_GOALS,
  payload: goals,
});

export const setUserProgress = (progress) => ({
  type: SET_USER_PROGRESS,
  payload: progress,
});

export const addUserProgressItem = (progressItem, progressType) => ({
  type: ADD_USER_PROGRESS_ITEM,
  payload: { progressItem, progressType },
});

export const removeUserProgressItem = (progressItemID, progressType) => ({
  type: REMOVE_USER_PROGRESS_ITEM,
  payload: { progressItemID, progressType },
});

export const editUserProgressItem = (
  progressItem,
  progressItemID,
  progressType
) => ({
  type: EDIT_USER_PROGRESS_ITEM,
  payload: {
    progressItem,
    progressItemID,
    progressType,
  },
});

export const setUserFoods = (foods) => ({
  type: SET_USER_FOODS,
  payload: foods,
});

export const addUserFood = (food) => ({
  type: ADD_USER_FOOD,
  payload: food,
});

export const removeUserFood = (foodId) => ({
  type: REMOVE_USER_FOOD,
  payload: foodId,
});
