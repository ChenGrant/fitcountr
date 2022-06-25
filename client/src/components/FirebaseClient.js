import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";

const FirebaseClient = ({ children }) => {
  useEffect(() => {
    (async () => {
      const response = await fetch("/firebaseClientConfig");
      const firebaseClientConfig = await response.json();
      initializeApp(firebaseClientConfig);
    })();
  }, []);

  return <>{children}</>;
};

export default FirebaseClient;
