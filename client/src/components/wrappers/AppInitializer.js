import React, { useContext } from "react";
import { FirebaseClientInitializerContext } from "./FirebaseClientInitializer";
import { FontsLoaderContext } from "./FontsLoader";

// AppInitializer waits for the fonts to load and the firebase client to be 
// initialized before rendering anything
const AppInitializer = ({ children }) => {
  const initializingFirebaseClient = useContext(
    FirebaseClientInitializerContext
  );
  const loadingFonts = useContext(FontsLoaderContext);

  if (initializingFirebaseClient || loadingFonts) return null;

  return <>{children}</>;
};

export default AppInitializer;
