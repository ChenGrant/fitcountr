import React, { useReducer } from "react";
import { Box, Typography } from "@mui/material";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import LoginForm from "../LoginForm";
import useScreenSize from "../../hooks/useScreenSize";

// -------------------------------------- CONSTANTS --------------------------------------
const LOGO_IMAGE_SRC =
  "https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Flogo%2Flogo.svg?alt=media&token=e67a9e25-c187-4c85-a9f1-5d3d88e9cd90";

const HERO_IMAGE_SRC =
  "https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Flaptop_phone%2Flaptop_phone.svg?alt=media&token=8cb4f69c-2763-4459-8eb0-2ab6ed0a1a9a";

const LOADED_LOGO_IMAGE = "LOADED_LOGO_IMAGE";

const LOADED_HERO_IMAGE = "LOADED_HERO_IMAGE";

const initialLoadingState = {
  logoImageIsLoaded: false,
  heroImageIsLoaded: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOADED_LOGO_IMAGE:
      return { ...state, logoImageIsLoaded: true };
    case LOADED_HERO_IMAGE:
      return { ...state, heroImageIsLoaded: true };
    default:
      return state;
  }
};

// -------------------------------------- COMPONENT --------------------------------------
const Home = () => {
  const { desktop } = useScreenSize();

  const firebaseClientIsInitialized = useSelector(
    (state) => state.firebaseClient.isInitialized
  );

  // loadingDependencies represents the loading status
  // for each image on the home page
  const [loadingDependencies, dispatch] = useReducer(
    reducer,
    initialLoadingState
  );

  // loading is false when all images have been fetched and
  // when the client firebase SDK has been initialized.
  const loading =
    !firebaseClientIsInitialized ||
    Object.values(loadingDependencies).reduce(
      (prev, curr) => !prev || !curr,
      false
    );

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
        gap={desktop ? "5vw" : 10}
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
              alt="logo"
              onLoad={() => dispatch({ type: LOADED_LOGO_IMAGE })}
              src={LOGO_IMAGE_SRC}
            />
          </Box>
          <Box>
            <Typography variant="h6" textAlign="center">
              Counting calories couldn't be any easier.
            </Typography>
          </Box>
          {/* Hero Image */}
          <Box width="100%">
            <Box
              component="img"
              width="100%"
              src={HERO_IMAGE_SRC}
              alt="hero"
              onLoad={() => dispatch({ type: LOADED_HERO_IMAGE })}
            />
          </Box>
        </Box>
        {/* LoginForm component */}
        <LoginForm />
      </Box>
    </Box>
  );
};

export default Home;
