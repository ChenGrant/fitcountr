import {
  INITIALIZED_FIREBASE_AUTH,
  INITIALIZED_FIREBASE_CLIENT,
} from "./firebaseClientTypes";

const initialState = {
  isInitialized: false,
  auth: null,
};

const firebaseClientReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZED_FIREBASE_CLIENT:
      return {
        ...state,
        isInitialized: true,
      };
    case INITIALIZED_FIREBASE_AUTH:
      return {
        ...state,
        auth: action.payload,
      };
    default:
      return state;
  }
};

export default firebaseClientReducer;
