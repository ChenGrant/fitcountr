import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const FirebaseAuthListener = ({ children }) => {
  const { auth } = useSelector((state) => state.firebaseClient);

  useEffect(() => {
    if (auth === null) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (newUser) => {});

    return unsubscribeAuth;
  }, [auth]);

  if (auth === null) return null;

  return <>{children}</>;
};

export default FirebaseAuthListener;
