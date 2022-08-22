import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NavigationBar from "../../components/layouts/navigationBar/NavigationBar";
import LoadingCircle from "../../components/miscellaneous/LoadingCircle";
import { setUserProfile, setUserProfilePictureURL } from "../../redux";
import { fetchUserProfile, fetchProfilePictureURL } from "../../utils";
import { ROUTE_PATHS } from "./routeUtils";

const AuthenticatedRoutes = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!user.auth.isLoggedIn || user.profilePicture.URL !== null) return;
      const { profilePictureURL } = await fetchProfilePictureURL(user);
      const profileData = await fetchUserProfile(user);
      user.profile === null && dispatch(setUserProfile(profileData));
      user.profilePicture.URL === null &&
        dispatch(setUserProfilePictureURL(profilePictureURL));
    })();
  }, [user, dispatch]);

  if (!user.auth.isLoggedIn) return <Navigate to={ROUTE_PATHS.HOME} />;

  if (!user.profilePicture.URL) return <LoadingCircle />;

  return (
    <NavigationBar>
      <Outlet />
    </NavigationBar>
  );
};

export default AuthenticatedRoutes;
