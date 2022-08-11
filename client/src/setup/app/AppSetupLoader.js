import React, { useContext } from "react";
import { useSelector } from "react-redux";
import LoadingCircle from "../../components/ui/LoadingCircle";
import { FontsInitializerContext } from "../fonts/FontsInitializerContext";

const AppSetupLoader = ({ children }) => {
  const { user } = useSelector((state) => state);
  const loadingFonts = useContext(FontsInitializerContext);

  // user.isInitialized being true implies initializingFirebaseClient is false
  if (loadingFonts || !user.isInitialized) return <LoadingCircle />;

  return children;
};

export default AppSetupLoader;
