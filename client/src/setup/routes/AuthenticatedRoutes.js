import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LargeScreenNavigationBar from "../../components/layouts/navigationBar/LargeScreenNavigationBar";
import SmallScreenNavigationBar from "../../components/layouts/navigationBar/SmallScreenNavigationBar";
import Wrapper from "../../components/miscellaneous/Wrapper";
import useScreenSize from "../../hooks/useScreenSize";
import { ROUTE_PATHS } from "./routeUtils";

const AuthenticatedRoutes = () => {
  const { user } = useSelector((state) => state);
  const { desktop } = useScreenSize();

  if (!user.isLoggedIn) return <Navigate to={ROUTE_PATHS.HOME} />;

  return (
    <Wrapper
      Component={desktop ? LargeScreenNavigationBar : SmallScreenNavigationBar}
    >
      <Outlet />
    </Wrapper>
  );
};

export default AuthenticatedRoutes;
