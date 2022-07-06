import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useDispatch } from "react-redux";
import { initializedFirebaseAuth, initializedFirebaseClient } from "../redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const FirebaseClientInitializer = ({ children }) => {
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

      // add listener for changes to user's sign-in state
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {});
      return unsubscribeAuth;
    })();
  }, [dispatch]);

  return <>{children}</>;
};

export default FirebaseClientInitializer;
