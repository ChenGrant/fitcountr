import { combineReducers } from "redux";
import firebaseClientReducer from "./firebaseClient/firebaseClientReducer";
import fontsReducer from "./fonts/fontsReducer";

const rootReducer = combineReducers({
  firebaseClient: firebaseClientReducer,
  fonts: fontsReducer,
});

export default rootReducer;
