import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import WebFont from "webfontloader";

const FontsLoader = ({ children }) => {
  const [loadingFonts, setLoadingFonts] = useState(true);
  const dispatch = useDispatch();

  // load fonts and when fonts are loaded, dispatch the loadedFonts
  // action to the redux store
  useEffect(() => {
    WebFont.load({
      google: { families: ["DM Sans", "Koulen", "Montserrat"] },
      active: () => setLoadingFonts(false),
      inactive: () => setLoadingFonts(false),
    });
  }, [dispatch]);

  if (loadingFonts) return null;

  return <>{children}</>;
};

export default FontsLoader;
