import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import WebFont from "webfontloader";
import { loadedFonts } from "../redux";

const FontsLoader = ({ children }) => {
  const dispatch = useDispatch();

  // load fonts and when fonts are loaded, dispatch the loadedFonts
  // action to the redux store
  useEffect(() => {
    WebFont.load({
      google: { families: ["DM Sans", "Koulen", "Montserrat"] },
      active: () => dispatch(loadedFonts()),
      inactive: () => dispatch(loadedFonts()),
    });
  }, [dispatch]);

  return <>{children}</>;
};

export default FontsLoader;
