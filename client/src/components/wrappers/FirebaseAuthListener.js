import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeUser,
  resetUser,
  setUser,
  setVerificationStatus,
} from "../../redux";
import Loading from "../pages/Loading/Loading";
import { fetchVerificationStatus } from "../../utils";

const FirebaseAuthListener = ({ children }) => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);

  useEffect(() => {
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

  if (!user.isInitialized) return <Loading />;

  return <>{children}</>;
};

export default FirebaseAuthListener;
