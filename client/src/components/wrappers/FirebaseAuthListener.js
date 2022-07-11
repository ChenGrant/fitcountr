import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";

const FirebaseAuthListener = ({ children }) => {
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (newUser) => {});

    return unsubscribeAuth;
  }, [auth]);

  return <>{children}</>;
};

export default FirebaseAuthListener;
