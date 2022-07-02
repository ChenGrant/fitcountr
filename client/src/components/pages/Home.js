import React, { useEffect, useReducer, useState } from "react";
import { Box, Typography } from "@mui/material";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import LoginForm from "../LoginForm";
import useScreenSize from "../../hooks/useScreenSize";
import SignupForm from "../SignupForm";

// -------------------------------------- CONSTANTS --------------------------------------
const SIGNUP_FORM = "SIGNUP_FORM";
const LOGIN_FORM = "LOGIN_FORM";

const ASSETS_ACTIONS = {
  FETCHED_LOGO_IMAGE_SRC: "FETCHED_LOGO_IMAGE_SRC",
  FETCHED_LAPTOP_PHONE_IMAGE_SRC: "FETCHED_LAPTOP_PHONE_IMAGE_SRC",
  LOADED_LOGO_IMAGE: "LOADED_LOGO_IMAGE",
  LOADED_LAPTOP_PHONE_IMAGE: "LOADED_LAPTOP_PHONE_IMAGE",
};

const initialAssetsState = {
  logo: {
    name: "logo",
    src: "",
    isLoaded: false,
    fetchAction: ASSETS_ACTIONS.FETCHED_LOGO_IMAGE_SRC,
  },
  laptopPhone: {
    name: "laptop_phone",
    src: "",
    isLoaded: false,
    fetchAction: ASSETS_ACTIONS.FETCHED_LAPTOP_PHONE_IMAGE_SRC,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case ASSETS_ACTIONS.FETCHED_LOGO_IMAGE_SRC:
      return { ...state, logo: { ...state.logo, src: action.payload } };
    case ASSETS_ACTIONS.FETCHED_LAPTOP_PHONE_IMAGE_SRC:
      return {
        ...state,
        laptopPhone: { ...state.laptopPhone, src: action.payload },
      };
    case ASSETS_ACTIONS.LOADED_LOGO_IMAGE:
      return { ...state, logo: { ...state.logo, isLoaded: true } };
    case ASSETS_ACTIONS.LOADED_LAPTOP_PHONE_IMAGE:
      return {
        ...state,
        laptopPhone: { ...state.laptopPhone, isLoaded: true },
      };
    default:
      return state;
  }
};

// -------------------------------------- COMPONENT --------------------------------------
const Home = () => {
  const { desktop } = useScreenSize();
  const [form, setForm] = useState(SIGNUP_FORM);
  const firebaseClientIsInitialized = useSelector(
    (state) => state.firebaseClient.isInitialized
  );
  // loadingDependencies represents the loading status
  // for each image on the home page
  const [assets, dispatch] = useReducer(reducer, initialAssetsState);

  useEffect(() => {
    const fetchAssets = async () => {
      Object.values(initialAssetsState).forEach(
        async ({ name, fetchAction }) => {
          const response = await fetch(`/asset/${name}`);
          const data = await response.json();
          const { assetURL } = data;
          dispatch({
            type: fetchAction,
            payload: assetURL,
          });
        }
      );
    };
    fetchAssets();
  }, []);

  // loading is false when all images have been fetched and
  // when the client firebase SDK has been initialized.
  const loading =
    !firebaseClientIsInitialized ||
    Object.values(assets).reduce(
      (prev, curr) => !prev || !curr.isLoaded,
      false
    );

  const toggleForm = () =>
    setForm(form === LOGIN_FORM ? SIGNUP_FORM : LOGIN_FORM);

  return (
    <Box height={desktop && "100vh"} py={!desktop && "8vh"} px="5vw">
      {/* render Loading component when loading */}
      {loading && <Loading />}
      <Box
        // display home page when no longer loading
        display={loading ? "none" : "flex"}
        flexDirection={desktop ? "row" : "column"}
        height={desktop && "100%"}
        justifyContent="center"
        alignItems="center"
        gap={desktop ? "5vw" : "10vh"}
      >
        <Box
          width={desktop ? "700px" : "100%"}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={5}
        >
          {/* Logo Image */}
          <Box display="flex" justifyContent="center">
            <Box
              component="img"
              style={{
                height: desktop && "60px",
                width: !desktop && "min(340px,100%)",
              }}
              src={assets.logo.src}
              alt="logo"
              onLoad={() =>
                dispatch({ type: ASSETS_ACTIONS.LOADED_LOGO_IMAGE })
              }
            />
          </Box>
          <Box>
            <Typography variant="h6" textAlign="center">
              Counting calories couldn't be any easier.
            </Typography>
          </Box>
          {/* Laptop Phone Image */}
          <Box width="100%">
            <Box
              component="img"
              width="100%"
              src={assets.laptopPhone.src}
              alt="laptop phone"
              onLoad={() =>
                dispatch({ type: ASSETS_ACTIONS.LOADED_LAPTOP_PHONE_IMAGE })
              }
            />
          </Box>
        </Box>
        {/* toggle between LoginForm and SignupForm components */}
        {form === LOGIN_FORM ? (
          <LoginForm toggleForm={toggleForm} />
        ) : (
          <SignupForm toggleForm={toggleForm} />
        )}
      </Box>
    </Box>
  );
};

export default Home;
