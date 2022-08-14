import {
  INITIALIZE_USER,
  RESET_USER,
  SET_AUTHENTICATING_USER,
  SET_USER_FIREBASE_DATA,
  SET_VERIFICATION_STATUS,
} from "./userTypes";

const initialState = {
  auth: {
    isInitialized: false,
    isAuthenticating: false,
    isVerified: null,
    isLoggedIn: false,
  },
  firebase: null,
};

const userReducer = (state = initialState, action) => {
  const user = (() => {
    switch (action.type) {
      case INITIALIZE_USER:
        return { ...state, auth: { ...state.auth, isInitialized: true } };

      case RESET_USER:
        return {
          ...initialState,
          auth: { ...initialState.auth, isInitialized: state.isInitialized },
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
