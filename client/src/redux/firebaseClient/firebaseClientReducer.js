import { INITIALIZE_FIREBASE_CLIENT } from "./firebaseClientTypes";

const initialState = {
  isInitialized: false,
};

const firebaseClientReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_FIREBASE_CLIENT:
      return {
        ...state,
        isInitialized: true,
      };
    default:
      return state;
  }
};

export default firebaseClientReducer;
