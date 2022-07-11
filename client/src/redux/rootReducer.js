import { combineReducers } from "redux";
import firebaseClientReducer from "./firebaseClient/firebaseClientReducer";
import userReducer from "./user/userReducer";

const rootReducer = combineReducers({
  firebaseClient: firebaseClientReducer,
  user: userReducer,
});

export default rootReducer;
