import React, { useEffect, useState } from "react";
import WebFont from "webfontloader";

// ------------------------------------- CONTEXT --------------------------------------
export const FontsLoaderContext = React.createContext();

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FontsLoader = ({ children }) => {
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
    <FontsLoaderContext.Provider value={loadingFonts}>
      {children}
    </FontsLoaderContext.Provider>
  );
};

export default FontsLoader;
