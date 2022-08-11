import React from "react";
import useScreenSize from "../../../hooks/useScreenSize";
import LargeScreenNavigationBar from "./LargeScreenNavigationBar";
import SmallScreenNavigationBar from "./SmallScreenNavigationBar";
import Wrapper from "../../miscellaneous/Wrapper";

const NavigationBar = ({ children }) => {
  const { desktop } = useScreenSize();
  return (
    <Wrapper
      Component={desktop ? LargeScreenNavigationBar : SmallScreenNavigationBar}
    >
      {children}
    </Wrapper>
  );
};

export default NavigationBar;
