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
} from "./userTypes";

const initialState = {
  auth: {
    isInitialized: false,
    isAuthenticating: false,
    isVerified: null,
    isLoggedIn: false,
  },
  firebase: null,
  profilePicture: {
    URL: null,
    isLoading: true,
  },
  profile: null,
  goals: null,
  progress: null,
};

const userReducer = (state = initialState, action) => {
  const user = (() => {
    switch (action.type) {
      case INITIALIZE_USER:
        return { ...state, auth: { ...state.auth, isInitialized: true } };

      case RESET_USER:
        return {
          ...initialState,
          auth: {
            ...initialState.auth,
            isInitialized: state.auth.isInitialized,
          },
        };

      case SET_USER_FIREBASE_DATA:
        return { ...state, firebase: action.payload };

      case SET_AUTHENTICATING_USER:
        return {
          ...state,
          auth: { ...state.auth, isAuthenticating: action.payload },
        };

      case SET_VERIFICATION_STATUS:
        return {
          ...state,
          auth: { ...state.auth, isVerified: action.payload === "Verified" },
        };

      case SET_USER_PROFILE_PICTURE_URL:
        return {
          ...state,
          profilePicture: {
            ...state.profilePicture,
            URL: action.payload,
          },
        };

      case SET_USER_PROFILE_PICTURE_IS_LOADING:
        return {
          ...state,
          profilePicture: {
            ...state.profilePicture,
            isLoading: action.payload,
          },
        };

      case SET_USER_PROFILE:
        return {
          ...state,
          profile: {
            ...state.profile,
            ...action.payload,
          },
        };

      case SET_USER_GOALS:
        return {
          ...state,
          goals: {
            ...state.goals,
            ...action.payload,
          },
        };

      case SET_USER_PROGRESS:
        return {
          ...state,
          progress: action.payload,
        };

      default:
        return state;
    }
  })();

  user.auth.isLoggedIn =
    user.auth.isInitialized &&
    user.auth.isVerified !== null &&
    user.auth.isVerified &&
    user.firebase !== null;

  return user;
};

export default userReducer;
