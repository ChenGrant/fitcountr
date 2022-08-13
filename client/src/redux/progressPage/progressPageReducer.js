import { SET_PROGRESS_PAGE_STAT } from "./progressPageTypes";

const initialState = {
  stat: null,
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
