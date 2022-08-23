import React, { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NavigationBar from "../../components/layouts/navigationBar/NavigationBar";
import LoadingCircle from "../../components/miscellaneous/LoadingCircle";
import {
  setUserGoals,
  setUserProfile,
  setUserProfilePictureURL,
} from "../../redux";
import {
  fetchUserProfile,
  fetchProfilePictureURL,
  fetchGoals,
} from "../../utils";
import { ROUTE_PATHS } from "./routeUtils";

const FETCHING_ACTIONS = {
  SET_FETCHING_GOALS: "SET_FETCHING_GOALS",
  SET_FETCHING_PROFILE: "SET_FETCHING_PROFILE",
  SET_FETCHING_PROFILE_PICTURE_URL: "SET_FETCHING_PROFILE_PICTURE_URL",
};

const INITIAL_FETCHING_STATE = {
  goals: false,
  profile: false,
  profilePictureURL: false,
};

const fetchingReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_ACTIONS.SET_FETCHING_GOALS:
      return { ...state, goals: action.payload };
    case FETCHING_ACTIONS.SET_FETCHING_PROFILE:
      return { ...state, profile: action.payload };
    case FETCHING_ACTIONS.SET_FETCHING_PROFILE_PICTURE_URL:
      return { ...state, profilePictureURL: action.payload };
    default:
      return state;
  }
};

const AuthenticatedRoutes = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [fetching, fetchingDispatch] = useReducer(
    fetchingReducer,
    INITIAL_FETCHING_STATE
  );

  useEffect(() => {
    (async () => {
      if (!user.auth.isLoggedIn) return;

      if (user.goals === null && !fetching.goals) {
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_GOALS,
          payload: true,
        });
        const goals = await fetchGoals(user)
        console.log(goals)
        dispatch(setUserGoals(goals));
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_GOALS,
          payload: false,
        });
      }

      if (user.profile === null && !fetching.profile) {
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_PROFILE,
          payload: true,
        });
        dispatch(setUserProfile(await fetchUserProfile(user)));
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_PROFILE,
          payload: false,
        });
      }

      if (user.profilePicture.URL === null && !fetching.profilePictureURL) {
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_PROFILE_PICTURE_URL,
          payload: true,
        });
        const { profilePictureURL } = await fetchProfilePictureURL(user);
        dispatch(setUserProfilePictureURL(profilePictureURL));
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_PROFILE_PICTURE_URL,
          payload: false,
        });
      }
    })();
  }, [
    user,
    fetching.goals,
    fetching.profile,
    fetching.profilePictureURL,
    dispatch,
  ]);

  if (!user.auth.isLoggedIn) return <Navigate to={ROUTE_PATHS.HOME} />;

  if (!user.goals || !user.profile || !user.profilePicture.URL)
    return <LoadingCircle />;

  return (
    <NavigationBar>
      <Outlet />
    </NavigationBar>
  );
};

export default AuthenticatedRoutes;
