import {
  SET_CURRENT_SEARCH_FOOD_PAGE,
  ADD_SEARCH_FOOD_PAGE,
  REMOVE_SEARCH_FOOD_PAGE,
  RESET_SEARCH_FOOD_PAGES,
} from "./searchFoodPageTypes";

export const setCurrentSearchFoodPage = (newCurrentPage) => ({
  type: SET_CURRENT_SEARCH_FOOD_PAGE,
  payload: newCurrentPage,
});

export const addSearchFoodPage = (newPage) => ({
  type: ADD_SEARCH_FOOD_PAGE,
  payload: newPage,
});

export const removeSearchFoodPage = () => ({ type: REMOVE_SEARCH_FOOD_PAGE });

export const resetSearchFoodPages = () => ({ type: RESET_SEARCH_FOOD_PAGES });
