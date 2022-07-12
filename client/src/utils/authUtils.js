import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setVerificationStatus } from "../redux";
import { GMAIL_PROVIDER, postSignupData } from "./fetchRequestUtils";

// handleAuthWithGmail signs in the user via their gmail account,
// creates an account for them if it is their first time signing in.
// If an account associated with the gmail already exists, the login
// method will be overridden to use gmail.
export const handleAuthWithGmail = async ({
  auth,
  dispatch,
  navigate,
  setOverriddenGmailUser,
  setGmailOverridePopupIsOpen,
  setGmailSignupButtonIsDisabled,
}) => {
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    setGmailSignupButtonIsDisabled(true);
    const { user } = result;
    const fetchedSignupData = await postSignupData(user, GMAIL_PROVIDER);
    if (fetchedSignupData.userIsCreated) {
      switch (fetchedSignupData.message) {
        case undefined:
        case "Email already in use, provider already uses Gmail":
          navigate("/dashboard");
          return;
        case "Email already in use, provider overridden to now use Gmail":
          setOverriddenGmailUser(user);
          setGmailOverridePopupIsOpen(true);
          return;
        default:
          break;
      }
    }
  } catch (error) {
    console.log(error.code);
  }
};
