import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { GMAIL_PROVIDER, postSignupData } from "../../../utils";
import { GMAIL_OVERRIDE_POPUP_STATES } from "../components/GmailOverridePopup";

// handleAuthWithGmail signs in the user via their gmail account,
// creates an account for them if it is their first time signing in.
// If an account associated with the gmail already exists, the login
// method will be overridden to use gmail.
export const handleAuthWithGmail = async (
  auth,
  setOverriddenGmailUser,
  setGmailOverridePopupState,
  setGmailButtonIsDisabled
) => {
  try {
    const googleAuthProvider = new GoogleAuthProvider();
    // prevents google auth from automatically selecting gmail
    googleAuthProvider.setCustomParameters({
      prompt: "select_account",
    });
    const result = await signInWithPopup(auth, googleAuthProvider);
    setGmailButtonIsDisabled(true);
    setGmailOverridePopupState(GMAIL_OVERRIDE_POPUP_STATES.PENDING);
    const { user } = result;

    const fetchedSignupData = await postSignupData(user, GMAIL_PROVIDER);
    if (fetchedSignupData.userIsCreated) {
      switch (fetchedSignupData.message) {
        case undefined:
        case "Email already in use, provider already uses Gmail":
          setGmailOverridePopupState(GMAIL_OVERRIDE_POPUP_STATES.CLOSED);
          return;
        case "Email already in use, provider overridden to now use Gmail":
          setOverriddenGmailUser(user);
          setGmailOverridePopupState(GMAIL_OVERRIDE_POPUP_STATES.OPEN);
          setGmailButtonIsDisabled(false);
          return;
        default:
          break;
      }
    }
  } catch (err) {
    console.log(err);
    setGmailButtonIsDisabled(false);
  }
};
