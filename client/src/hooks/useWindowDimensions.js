import { useEffect, useState } from "react";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

const RESIZE_EVENT_NAME = "resize";

// returns an object with 'width' and 'height' properties that
// represent the width and height of the window in pixels respectively
const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const handleResize = () => setWindowDimensions(getWindowDimensions());

  useEffect(() => {
    window.addEventListener(RESIZE_EVENT_NAME, handleResize);
    return () => window.removeEventListener(RESIZE_EVENT_NAME, handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
