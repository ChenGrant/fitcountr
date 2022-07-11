import { RESET_USER, SET_USER, SET_VERIFICATION_STATUS } from "./userTypes";

const initialState = {
  isInitialized: false,
  user: null,
  isVerified: null,
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  let newUser;
  switch (action.type) {
    case RESET_USER:
      return { ...initialState };
    case SET_USER:
      newUser = { ...state, isInitialized: true, user: action.payload };
      break;

    case SET_VERIFICATION_STATUS:
      newUser = { ...state, isVerified: action.payload === "Verified" };
      break;

    default:
      newUser = state;
      break;
  }
  newUser.isLoggedIn =
    newUser.isInitialized && newUser.isVerified && newUser.user !== null;
  return newUser;
};

export default userReducer;
