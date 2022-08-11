import React, { useEffect, useState } from "react";
import WebFont from "webfontloader";
import { FontsInitializerContextProvider } from "./FontsInitializerContext";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FontsInitializer = ({ children }) => {
  const [loadingFonts, setLoadingFonts] = useState(true);

  // fetch fonts
  useEffect(() => {
    WebFont.load({
      google: { families: ["DM Sans", "Koulen", "Montserrat"] },
      active: () => setLoadingFonts(false),
      inactive: () => setLoadingFonts(false),
    });
  }, []);

  return (
    <FontsInitializerContextProvider value={loadingFonts}>
      {children}
    </FontsInitializerContextProvider>
  );
};

export default FontsInitializer;
