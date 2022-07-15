import React, { useContext } from "react";
import { useSelector } from "react-redux";
import Loading from "../pages/Loading/Loading";
import { FontsLoaderContext } from "./FontsLoader";

const LoadingInitializer = ({ children }) => {
  const { user } = useSelector((state) => state);
  const loadingFonts = useContext(FontsLoaderContext);

  // user.isInitialized being true implies initializingFirebaseClient is false
  if (loadingFonts || !user.isInitialized) return <Loading />;

  return <>{children}</>;
};

export default LoadingInitializer;
