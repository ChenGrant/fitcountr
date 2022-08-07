import { SEARCH_FOOD_PAGES, Stack } from "../../utils";
import {
  SET_CURRENT_SEARCH_FOOD_PAGE,
  ADD_SEARCH_FOOD_PAGE,
  REMOVE_SEARCH_FOOD_PAGE,
  RESET_SEARCH_FOOD_PAGES,
} from "./searchFoodPageTypes";

const initialState = new Stack();
initialState.push({ name: SEARCH_FOOD_PAGES.SELECT_SEARCH_METHOD });

// ------------------------------------ FUNCTIONS ------------------------------------
const copyState = (state) =>
  Object.assign(Object.create(Object.getPrototypeOf(state)), state);

const addPage = (state, newPage) => {
  const stateCopy = copyState(state);
  stateCopy.push(newPage);
  return stateCopy;
};

const removePage = (state) => {
  const stateCopy = copyState(state);
  stateCopy.pop();
  return stateCopy;
};

// ------------------------------------- REDUCER -------------------------------------
const searchFoodPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_SEARCH_FOOD_PAGE:
      return addPage(removePage(state), action.payload);

    case ADD_SEARCH_FOOD_PAGE:
      return addPage(state, action.payload);

    case REMOVE_SEARCH_FOOD_PAGE:
      return removePage(state);

    case RESET_SEARCH_FOOD_PAGES:
      return copyState(initialState);

    default:
      return state;
  }
};

export default searchFoodPageReducer;
