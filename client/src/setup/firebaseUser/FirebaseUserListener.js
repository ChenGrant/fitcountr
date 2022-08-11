import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeUser,
  resetUser,
  setUser,
  setVerificationStatus,
} from "../../redux";
import { fetchVerificationStatus } from "../../utils";
import { FirebaseClientInitializerContext } from "../firebaseClient/FirebaseClientInitializerContext";

const FirebaseUserListener = ({ children }) => {
  const initializingFirebaseClient = useContext(
    FirebaseClientInitializerContext
  );
  const [auth, setAuth] = useState();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);

  useEffect(() => {
    !initializingFirebaseClient && setAuth(getAuth());
  }, [initializingFirebaseClient]);

  useEffect(() => {
    if (auth === undefined) return;

    const unsubscribeAuth = onAuthStateChanged(auth, async (newUser) => {
      if (user.isAuthenticating) return;

      dispatch(resetUser(newUser));
      dispatch(setUser(newUser));
      if (newUser) {
        const responseData = await fetchVerificationStatus(newUser.email);
        dispatch(setVerificationStatus(responseData.verificationStatus));
      }
      dispatch(initializeUser());
    });

    return unsubscribeAuth;
  }, [auth, user.isAuthenticating, dispatch]);

  return children;
};

export default FirebaseUserListener;
