import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeUser,
  resetUser,
  setUserFirebaseData,
  setVerificationStatus,
} from "../../redux";
import { fetchVerificationStatus } from "../../utils";
import { FirebaseClientInitializerContext } from "../firebaseClient/FirebaseClientInitializerContext";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FirebaseUserListener = ({ children }) => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const initializingFirebaseClient = useContext(
    FirebaseClientInitializerContext
  );
  const [auth, setAuth] = useState();

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    !initializingFirebaseClient && setAuth(getAuth());
  }, [initializingFirebaseClient]);

  useEffect(() => {
    if (auth === undefined) return;

    const unsubscribeAuth = onAuthStateChanged(auth, async (newUser) => {
      if (user.auth.isAuthenticating) return;

      dispatch(resetUser(newUser));
      dispatch(setUserFirebaseData(newUser));
      if (newUser) {
        const responseData = await fetchVerificationStatus(newUser.email);
        dispatch(setVerificationStatus(responseData.verificationStatus));
      }
      dispatch(initializeUser());
    });

    return unsubscribeAuth;
  }, [auth, user.auth.isAuthenticating, dispatch]);

  // ------------------------------------- RENDER -------------------------------------
  return children;
};

export default FirebaseUserListener;
