import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "../../utils";
import { FirebaseClientInitializerContextProvider } from "./FirebaseClientInitializerContext";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FirebaseClientInitializer = ({ children }) => {
    const [initializingFirebaseClient, setInitializingFirebaseClient] =
        useState(true);

    // fetch Firebase client configuration object from server and initialize app
    useEffect(() => {
        (async () => {
            const app = initializeApp(firebaseConfig);
            getAuth(app);
            setInitializingFirebaseClient(false);
        })();
    }, []);

    return (
        <FirebaseClientInitializerContextProvider
            value={initializingFirebaseClient}
        >
            {children}
        </FirebaseClientInitializerContextProvider>
    );
};

export default FirebaseClientInitializer;
