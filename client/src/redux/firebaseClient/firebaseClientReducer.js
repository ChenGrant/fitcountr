import {
  INITIALIZE_FIREBASE_AUTH,
  INITIALIZE_FIREBASE_CLIENT,
} from "./firebaseClientTypes";

const initialState = {
  isInitialized: false,
  auth: null,
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
    default:
      return state;
  }
};

export default firebaseClientReducer;
