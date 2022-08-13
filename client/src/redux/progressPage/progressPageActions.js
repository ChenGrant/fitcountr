import { RESET_PROGRESS_PAGE_STAT, SET_PROGRESS_PAGE_STAT } from "./progressPageTypes";

export const setProgressPageStat = (newStat) => ({
  type: SET_PROGRESS_PAGE_STAT,
  payload: newStat,
});

export const resetProgressPageStat = () => ({
  type: RESET_PROGRESS_PAGE_STAT
});