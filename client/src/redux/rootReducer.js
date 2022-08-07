import { combineReducers } from "redux";
import searchFoodPageReducer from "./searchFoodPage/searchFoodPageReducer";
import userReducer from "./user/userReducer";

const rootReducer = combineReducers({
  user: userReducer,
  searchFoodPage: searchFoodPageReducer,
});

export default rootReducer;
