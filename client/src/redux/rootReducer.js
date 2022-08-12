import { combineReducers } from "redux";
import progressPageReducer from "./progressPage/progressPageReducer";
import searchFoodPageReducer from "./searchFoodPage/searchFoodPageReducer";
import userReducer from "./user/userReducer";

const rootReducer = combineReducers({
  user: userReducer,
  searchFoodPage: searchFoodPageReducer,
  progressPage: progressPageReducer,
});

export default rootReducer;
