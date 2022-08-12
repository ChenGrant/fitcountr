import { SET_STAT } from "./progressPageTypes";

export const setStat = (newStat) => ({
  type: SET_STAT,
  payload: newStat,
});
