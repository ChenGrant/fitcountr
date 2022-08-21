import {
  RESET_PROGRESS_PAGE_TYPE,
  SET_PROGRESS_PAGE_TYPE,
} from "./progressPageTypes";

const initialState = {
  progressType: null,
};

const progressPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PROGRESS_PAGE_TYPE:
      return initialState;
    case SET_PROGRESS_PAGE_TYPE:
      return { ...state, progressType: action.payload };
    default:
      return state;
  }
};

export default progressPageReducer;
