import { PROGRESS_TYPES } from "../../utils";
import { SET_PROGRESS_PAGE_STAT } from "./progressPageTypes";

const initialState = {
  stat: Object.values(PROGRESS_TYPES).reduce((prev, curr) =>
    prev.localeCompare(curr) < 0 ? prev : curr
  ),
};

const progressPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROGRESS_PAGE_STAT:
      return { ...state, stat: action.payload };
    default:
      return state;
  }
};

export default progressPageReducer;
