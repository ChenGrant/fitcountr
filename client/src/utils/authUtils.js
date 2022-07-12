import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { GMAIL_OVERRIDE_POPUP_STATES } from "../components/pages/Home/GmailOverridePopup";
import { GMAIL_PROVIDER, postSignupData } from "./fetchRequestUtils";

// handleAuthWithGmail signs in the user via their gmail account,
// creates an account for them if it is their first time signing in.
// If an account associated with the gmail already exists, the login
// method will be overridden to use gmail.
export const handleAuthWithGmail = async (
  auth,
  navigate,
  setOverriddenGmailUser,
  setGmailOverridePopupState,
  setGmailButtonIsDisabled
) => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    setGmailButtonIsDisabled(true);
    setGmailOverridePopupState(GMAIL_OVERRIDE_POPUP_STATES.PENDING);
    const { user } = result;
    const fetchedSignupData = await postSignupData(user, GMAIL_PROVIDER);
    if (fetchedSignupData.userIsCreated) {
      switch (fetchedSignupData.message) {
        case undefined:
        case "Email already in use, provider already uses Gmail":
          setGmailOverridePopupState(GMAIL_OVERRIDE_POPUP_STATES.CLOSED);
          navigate("/dashboard");
          return;
        case "Email already in use, provider overridden to now use Gmail":
          setOverriddenGmailUser(user);
          setGmailOverridePopupState(GMAIL_OVERRIDE_POPUP_STATES.OPEN);
          return;
        default:
          break;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
