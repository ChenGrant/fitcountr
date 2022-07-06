import useWindowDimensions from "./useWindowDimensions";
import { useTheme } from "@mui/styles";

// returns an object with 'desktop', 'tablet', 'phone' properties that represent
// different screen sizes.
// For example, if the 'desktop' property of the returned object is true, then
// the size of the screen is classified as a desktop screen.
const useScreenSize = () => {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const screenSize = {
    desktop: false,
    tablet: false,
    phone: false,
  };

  if (width >= theme.breakpoints.values.md) {
    screenSize.desktop = true;
  } else if (width >= theme.breakpoints.values.sm) {
    screenSize.tablet = true;
  } else if (width >= theme.breakpoints.values.xs) {
    screenSize.phone = true;
  }

  return screenSize;
};

export default useScreenSize;
