import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useDispatch } from "react-redux";
import { initializeFirebaseAuth, initializeFirebaseClient } from "../redux";
import { getAuth } from "firebase/auth";

const FirebaseClientProvider = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const response = await fetch("/firebaseClientConfig");
      const firebaseClientConfig = await response.json();
      const app = initializeApp(firebaseClientConfig);
      dispatch(initializeFirebaseClient());
      const auth = getAuth(app);
      dispatch(initializeFirebaseAuth(auth));
    })();
  }, [dispatch]);

  return <>{children}</>;
};

export default FirebaseClientProvider;
