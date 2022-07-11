import { RESET_USER, SET_USER, SET_VERIFICATION_STATUS } from "./userTypes";

export const resetUser = () => {
  return { type: RESET_USER };
};

export const setUser = (user) => {
  return { type: SET_USER, payload: user };
};

export const setVerificationStatus = (verificationStatus) => {
  return { type: SET_VERIFICATION_STATUS, payload: verificationStatus };
};
