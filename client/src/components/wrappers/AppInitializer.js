import React, { useContext } from "react";
import Loading from "../pages/Loading/Loading";
import { FirebaseClientInitializerContext } from "./FirebaseClientInitializer";
import { FontsLoaderContext } from "./FontsLoader";

// AppInitializer waits for the fonts to load and the firebase client to be 
// initialized before rendering anything
const AppInitializer = ({ children }) => {
  const initializingFirebaseClient = useContext(
    FirebaseClientInitializerContext
  );
  const loadingFonts = useContext(FontsLoaderContext);

  if (initializingFirebaseClient || loadingFonts) return <Loading/>;

  return <>{children}</>;
};

export default AppInitializer;
