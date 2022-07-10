import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { useDispatch } from "react-redux";
import {
  initializedFirebaseAuth,
  initializedFirebaseClient,
} from "../../redux";
import { getAuth } from "firebase/auth";

const FirebaseClientInitializer = ({ children }) => {
  const [initializingFirebaseClient, setInitializingFirebaseClient] =
    useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      // fetch firebase client configuration object from server
      const response = await fetch("/firebaseClientConfig");
      const firebaseClientConfig = await response.json();

      // initialize firebase app with the fetched configuration object
      // and dispatch initializeFirebaseClient action to redux store
      const app = initializeApp(firebaseClientConfig);
      dispatch(initializedFirebaseClient());

      // initialize firebase auth and store reference to the service and
      // dispatch initializeFirebaseAuth action to redux store
      const auth = getAuth(app);
      dispatch(initializedFirebaseAuth(auth));

      setInitializingFirebaseClient(false);
    })();
  }, [dispatch]);

  if (initializingFirebaseClient) return null;

  return <>{children}</>;
};

export default FirebaseClientInitializer;
