import {
  INITIALIZE_USER,
  RESET_USER,
  SET_AUTHENTICATING_USER,
  SET_USER_FIREBASE_DATA,
  SET_VERIFICATION_STATUS,
} from "./userTypes";

const initialState = {
  isAuthenticating: false,
  isInitialized: false,
  firebase: null,
  isVerified: null,
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  const newUser = (() => {
    switch (action.type) {
      case INITIALIZE_USER:
        return { ...state, isInitialized: true };

      case RESET_USER:
        return { ...initialState, isInitialized: state.isInitialized };

      case SET_USER_FIREBASE_DATA:
        return { ...state, firebase: action.payload };

      case SET_AUTHENTICATING_USER:
        return { ...state, isAuthenticating: action.payload };

      case SET_VERIFICATION_STATUS:
        return { ...state, isVerified: action.payload === "Verified" };

      default:
        return state;
    }
  })();

  newUser.isLoggedIn =
    newUser.isInitialized &&
    newUser.isVerified !== null &&
    newUser.isVerified &&
    newUser.user !== null;

  return newUser;
};

export default userReducer;
