import { LOADED_FONTS } from "./fontsTypes";

const initialState = {
  loading: true,
};

const fontsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADED_FONTS:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default fontsReducer;
