import {
  SET_PROGRESS_PAGE_TYPE,
  RESET_PROGRESS_PAGE_TYPE,
} from "./progressPageTypes";

export const setProgressPageType = (progressType) => ({
  type: SET_PROGRESS_PAGE_TYPE,
  payload: progressType,
});

export const resetProgressPageType = () => ({
  type: RESET_PROGRESS_PAGE_TYPE,
});
