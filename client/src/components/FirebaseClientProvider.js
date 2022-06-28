import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useDispatch } from "react-redux";
import { initializeFirebaseClient } from "../redux";

const FirebaseClientProvider = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const response = await fetch("/firebaseClientConfig");
      const firebaseClientConfig = await response.json();
      initializeApp(firebaseClientConfig);
      dispatch(initializeFirebaseClient());
    })();
  }, [dispatch]);

  return <>{children}</>;
};

export default FirebaseClientProvider;