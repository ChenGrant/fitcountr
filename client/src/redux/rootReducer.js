import { combineReducers } from "redux";
import firebaseClientReducer from "./firebaseClient/firebaseClientReducer";

const rootReducer = combineReducers({
  firebaseClient: firebaseClientReducer
});

export default rootReducer;
