import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import WebFont from "webfontloader";
import { loadedFonts } from "../redux";

const FontsLoader = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    WebFont.load({
      google: { families: ["DM Sans", "Koulen", "Montserrat"] },
      active: () => dispatch(loadedFonts()),
    });
  }, []);

  return <>{children}</>;
};

export default FontsLoader;
