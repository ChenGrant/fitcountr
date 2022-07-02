import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { useDispatch } from "react-redux";
import { initializeFirebaseAuth, initializeFirebaseClient } from "../redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const FirebaseClientInitializer = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const response = await fetch("/firebaseClientConfig");
      const firebaseClientConfig = await response.json();
      const app = initializeApp(firebaseClientConfig);
      dispatch(initializeFirebaseClient());
      const auth = getAuth(app);
      dispatch(initializeFirebaseAuth(auth));
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        console.log(user);
      });
      return unsubscribeAuth
    })();
  }, [dispatch]);

  return <>{children}</>;
};

export default FirebaseClientInitializer;
