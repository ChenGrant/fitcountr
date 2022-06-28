import {
  INITIALIZE_FIREBASE_AUTH,
  INITIALIZE_FIREBASE_CLIENT,
  SIGN_IN_USER,
} from "./firebaseClientTypes";

const initialState = {
  isInitialized: false,
  auth: null,
  user: null,
};

const firebaseClientReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_FIREBASE_CLIENT:
      return {
        ...state,
        isInitialized: true,
      };
    case INITIALIZE_FIREBASE_AUTH:
      return {
        ...state,
        auth: action.payload,
      };
    case SIGN_IN_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default firebaseClientReducer;
