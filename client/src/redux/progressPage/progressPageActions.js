import { SET_PROGRESS_PAGE_STAT } from "./progressPageTypes";

export const setProgressPageStat = (newStat) => ({
  type: SET_PROGRESS_PAGE_STAT,
  payload: newStat,
});
