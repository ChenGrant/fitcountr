import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { fetchFirebaseClientConfig } from "../../utils";

export const FirebaseClientInitializerContext = React.createContext();

const FirebaseClientInitializer = ({ children }) => {
  const [initializingFirebaseClient, setInitializingFirebaseClient] =
    useState(true);

  useEffect(() => {
    (async () => {
      // fetch firebase client configuration object from server
      const firebaseClientConfig = await fetchFirebaseClientConfig();
      const app = initializeApp(firebaseClientConfig);
      getAuth(app);
      setInitializingFirebaseClient(false);
    })();
  }, []);

  return (
    <FirebaseClientInitializerContext.Provider
      value={initializingFirebaseClient}
    >
      {children}
    </FirebaseClientInitializerContext.Provider>
  );
};

export default FirebaseClientInitializer;
