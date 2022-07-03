import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import LoginForm from "../LoginForm";
import useScreenSize from "../../hooks/useScreenSize";
import SignupForm from "../SignupForm";
import useAsset from "../../hooks/useAsset";

// -------------------------------------- CONSTANTS --------------------------------------
const SIGNUP_FORM = "SIGNUP_FORM";
const LOGIN_FORM = "LOGIN_FORM";

// -------------------------------------- COMPONENT --------------------------------------
const Home = () => {
  const { desktop } = useScreenSize();
  const [form, setForm] = useState(SIGNUP_FORM);
  const firebaseClientIsInitialized = useSelector(
    (state) => state.firebaseClient.isInitialized
  );

  const { assets, assetsDispatchers, loadingAssets } = useAsset({
    logo: { name: "logo" },
    laptopPhone: { name: "laptop_phone" },
  });

  // loading is false when all images have been fetched and
  // when the client firebase SDK has been initialized.
  const loading = !firebaseClientIsInitialized || loadingAssets;

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
              onLoad={() => assetsDispatchers.logo.setLoading(false)}
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
              onLoad={() => assetsDispatchers.laptopPhone.setLoading(false)}
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
