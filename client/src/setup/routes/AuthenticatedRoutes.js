import React, { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NavigationBar from "../../components/layouts/navigationBar/NavigationBar";
import LoadingCircle from "../../components/miscellaneous/LoadingCircle";
import {
  setUserGoals,
  setUserProfile,
  setUserProfilePictureURL,
  setUserProgress,
} from "../../redux";
import {
  fetchUserProfile,
  fetchProfilePictureURL,
  fetchGoals,
  fetchProgress,
} from "../../utils";
import { ROUTE_PATHS } from "./routeUtils";

// --------------------------------- FETCHING REDUCER ---------------------------------
const FETCHING_ACTIONS = {
  SET_FETCHING_GOALS: "SET_FETCHING_GOALS",
  SET_FETCHING_PROFILE: "SET_FETCHING_PROFILE",
  SET_FETCHING_PROFILE_PICTURE_URL: "SET_FETCHING_PROFILE_PICTURE_URL",
  SET_FETCHING_PROGRESS: "SET_FETCHING_PROGRESS",
};

const INITIAL_FETCHING_STATE = {
  goals: false,
  profile: false,
  profilePictureURL: false,
  progress: false,
};

const fetchingReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_ACTIONS.SET_FETCHING_GOALS:
      return { ...state, goals: action.payload };
    case FETCHING_ACTIONS.SET_FETCHING_PROFILE:
      return { ...state, profile: action.payload };
    case FETCHING_ACTIONS.SET_FETCHING_PROFILE_PICTURE_URL:
      return { ...state, profilePictureURL: action.payload };
    case FETCHING_ACTIONS.SET_FETCHING_PROGRESS:
      return { ...state, progress: action.payload };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const AuthenticatedRoutes = () => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [fetching, fetchingDispatch] = useReducer(
    fetchingReducer,
    INITIAL_FETCHING_STATE
  );

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    (async () => {
      if (!user.auth.isLoggedIn) return;

      if (user.goals === null && !fetching.goals) {
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_GOALS,
          payload: true,
        });
        dispatch(setUserGoals(await fetchGoals(user)));
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_GOALS,
          payload: false,
        });
      }
    })();
  }, [user, fetching.goals, dispatch]);

  useEffect(() => {
    (async () => {
      if (!user.auth.isLoggedIn) return;

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
    })();
  }, [user, fetching.profile, dispatch]);

  useEffect(() => {
    (async () => {
      if (!user.auth.isLoggedIn) return;

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
  }, [user, fetching.profilePictureURL, dispatch]);

  useEffect(() => {
    (async () => {
      if (!user.auth.isLoggedIn) return;

      if (user.progress === null && !fetching.progress) {
        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_PROGRESS,
          payload: true,
        });

        const progress = await fetchProgress(user);

        console.log(progress);
        dispatch(setUserProgress(progress));

        fetchingDispatch({
          type: FETCHING_ACTIONS.SET_FETCHING_PROGRESS,
          payload: false,
        });
      }
    })();
  }, [user, fetching.progress, dispatch]);

  // ------------------------------------- RENDER -------------------------------------
  if (!user.auth.isLoggedIn) return <Navigate to={ROUTE_PATHS.HOME} />;

  if (
    !user.goals ||
    !user.profile ||
    !user.profilePicture.URL ||
    !user.progress
  )
    return <LoadingCircle />;

  return (
    <NavigationBar>
      <Outlet />
    </NavigationBar>
  );
};

export default AuthenticatedRoutes;
