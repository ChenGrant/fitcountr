import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import LoginForm from "./LoginForm";
import useScreenSize from "../../../hooks/useScreenSize";
import SignupForm from "./SignupForm";
import useAsset from "../../../hooks/useAsset";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import GmailOverridePopup, {
  GMAIL_OVERRIDE_POPUP_STATES,
} from "./GmailOverridePopup";
import { ROUTE_PATHS } from "../../../setup/routes/routeUtils";
import LoadingCircle from "../../../components/miscellaneous/LoadingCircle";

// ------------------------------------ CONSTANTS ------------------------------------
const SIGNUP_FORM = "SIGNUP_FORM";
const LOGIN_FORM = "LOGIN_FORM";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const Home = () => {
  const { desktop } = useScreenSize();
  const [form, setForm] = useState(SIGNUP_FORM);
  const [assets, assetsDispatchers, loadingAssets] = useAsset({
    logo: { name: "logo" },
    laptopPhone: { name: "laptop_phone" },
  });
  const { user } = useSelector((state) => state);
  const [gmailOverridePopupState, setGmailOverridePopupState] = useState(
    GMAIL_OVERRIDE_POPUP_STATES.CLOSED
  );
  const [overriddenGmailUser, setOverriddenGmailUser] = useState();

  const pageIsLoading = loadingAssets;

  // ----------------------------------- FUNCTIONS -----------------------------------
  // toggleForm toggles the value of the 'form' state variable between
  // SIGNUP_FORM and LOGIN_FORM
  const toggleForm = () =>
    setForm(form === LOGIN_FORM ? SIGNUP_FORM : LOGIN_FORM);

  // ------------------------------------- RENDER -------------------------------------
  if (
    user.isLoggedIn &&
    !user.isCreating &&
    gmailOverridePopupState === GMAIL_OVERRIDE_POPUP_STATES.CLOSED
  )
    return <Navigate to={ROUTE_PATHS.DASHBOARD} />;

  return (
    <Box height={desktop && "100vh"} px="5vw">
      {/* render LoadingCircle component when loading */}
      {pageIsLoading && <LoadingCircle />}
      {/* display home page when no longer loading */}
      <Box
        py={!desktop && "8vh"}
        display={pageIsLoading ? "none" : "flex"}
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
          <LoginForm
            toggleForm={toggleForm}
            setGmailOverridePopupState={setGmailOverridePopupState}
            setOverriddenGmailUser={setOverriddenGmailUser}
          />
        ) : (
          <SignupForm
            toggleForm={toggleForm}
            setGmailOverridePopupState={setGmailOverridePopupState}
            setOverriddenGmailUser={setOverriddenGmailUser}
          />
        )}
        {/* Gmail override popup */}
        <GmailOverridePopup
          gmailOverridePopupState={gmailOverridePopupState}
          setGmailOverridePopupState={setGmailOverridePopupState}
          overriddenGmailUser={overriddenGmailUser}
        />
      </Box>
    </Box>
  );
};

export default Home;
