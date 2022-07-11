import { SET_USER, SET_VERIFICATION_STATUS } from "./userTypes";

const initialState = {
  isInitialized: false,
  user: null,
  isVerified: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, isInitialized: true, user: action.payload };
    }
    case SET_VERIFICATION_STATUS:
      return { ...state, isVerified: action.payload === "Verified" };
    default:
      return state;
  }
};

export default userReducer;
