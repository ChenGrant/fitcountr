import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { fetchFirebaseClientConfig } from "../../../utils";

// ------------------------------------- CONTEXT --------------------------------------
export const FirebaseClientInitializerContext = React.createContext();

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FirebaseClientInitializer = ({ children }) => {
  const [initializingFirebaseClient, setInitializingFirebaseClient] =
    useState(true);

  // fetch Firebase client configuration object from server and initialize app
  useEffect(() => {
    (async () => {
      const fetchedFirebaseClientConfig = await fetchFirebaseClientConfig();
      const app = initializeApp(fetchedFirebaseClientConfig);
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
