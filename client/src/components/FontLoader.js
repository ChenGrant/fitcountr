import React, { useEffect, useState } from "react";
import WebFont from "webfontloader";

export const FontLoaderContext = React.createContext();
const FontLoaderProvider = FontLoaderContext.Provider;

const FontLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["DM Sans", "Koulen", "Montserrat"],
      },
      active: () => setLoading(false),
    });
  }, []);
  return <FontLoaderProvider value={loading}>{children}</FontLoaderProvider>;
};

export default FontLoader;
