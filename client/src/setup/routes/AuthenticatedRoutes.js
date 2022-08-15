import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NavigationBar from "../../components/layouts/navigationBar/NavigationBar";
import { fetchProfilePictureURL } from "../../utils";
import { ROUTE_PATHS } from "./routeUtils";

const AuthenticatedRoutes = () => {
  const { user } = useSelector((state) => state);

  useEffect(() => {
    (async () => {
      if (!user.auth.isLoggedIn) return;
      const fetchedProfilePictureURL = await fetchProfilePictureURL(user);
      console.log(fetchedProfilePictureURL);
    })();
  }, [user]);

  if (!user.auth.isLoggedIn) return <Navigate to={ROUTE_PATHS.HOME} />;

  return (
    <NavigationBar>
      <Outlet />
    </NavigationBar>
  );
};

export default AuthenticatedRoutes;
