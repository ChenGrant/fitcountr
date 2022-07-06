import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PinInput from "react-pin-input";
import { CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import useScreenSize from "../../../hooks/useScreenSize";
import Loading from "../Loading/Loading";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useAsset from "../../../hooks/useAsset";
import CustomButton from "../../../mui/CustomButton";
import EmailVerificationPopup from "./EmailVerificationPopup";
import { useSelector } from "react-redux";

// -------------------------------- CONSTANTS --------------------------------
const EMAIL_VERIFICATION_POPUP_STATES = {
  CLOSED: "CLOSED",
  SENDING: "SENDING",
  SENT_SUCCESS: "SENT_SUCCESS",
  SENT_FAILED: "SENT_FAILED",
};

// --------------------------------- REDUCERS ---------------------------------
const PIN_ACTIONS = {
  VERIFYING: "VERIFYING",
  FINISHED_VERIFYING: "FINISHED_VERIFYING",
  VERIFIED: "VERIFIED",
  DENIED: "DENIED",
  INITIALIZE_LENGTH: "INITIALIZE_LENGTH",
};

const initialPinState = {
  verifying: false,
  verified: false,
  denied: false,
  length: 0,
};

const pinReducer = (state, action) => {
  switch (action.type) {
    case PIN_ACTIONS.VERIFYING:
      return { ...state, verifying: true };
    case PIN_ACTIONS.FINISHED_VERIFYING:
      return { ...state, verifying: false };
    case PIN_ACTIONS.VERIFIED:
      return { ...state, verifying: false, verified: true, denied: false };
    case PIN_ACTIONS.DENIED:
      return { ...state, verifying: false, verified: false, denied: true };
    case PIN_ACTIONS.INITIALIZE_LENGTH:
      return { ...state, length: action.payload };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const EmailVerification = () => {
  const { email } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { desktop, tablet, phone } = useScreenSize();
  const [assets, assetsDispatchers, loadingAssets] = useAsset({
    emailPending: { name: "email_pending" },
    emailVerified: { name: "email_verified" },
    emailDenied: { name: "email_denied" },
  });
  const loadingFonts = useSelector((state) => state.fonts.loading);
  const [pin, dispatch] = useReducer(pinReducer, initialPinState);
  const [emailAlreadyVerified, setEmailAlreadyVerified] = useState(false);
  const [emailDoesNotExist, setEmailDoesNotExist] = useState(false);
  const [emailAwaitsVerification, setEmailAwaitsVerification] = useState(false);
  const [fetchingVerificationStatus, setFetchingVerificationStatus] =
    useState(true);
  const [sendingEmailPopup, setSendingEmailPopup] = useState(
    EMAIL_VERIFICATION_POPUP_STATES.CLOSED
  );

  const [imageSrc, setImageSrc] = useState("");

  const pageIsLoading =
    fetchingVerificationStatus || loadingAssets || loadingFonts;

  // ----------------------------------- FUNCTIONS -----------------------------------
  // given a receiver email, sendVerificationEmail opens the
  // EmailVerificationPopup component and sends a verification email to the
  // receiver email with the email verification pin
  const sendVerificationEmail = async (email) => {
    setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENDING);
    const response = await fetch("/emailVerification/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    // verification email failed to send
    if (data.message === "Could not send verification email") {
      return setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENT_FAILED);
    }
    // verification email successfully sent
    return setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENT_SUCCESS);
  };

  // given an email and a pin, verifyEmail determines if the email
  // does not exist, is already verified, or is pending verification.
  // If the email is pending verification, this function also provides
  // the number of digits in email's verification pin.
  const verifyEmail = useCallback(
    async (email, pin) => {
      // render loading spinner for pin input
      dispatch({ type: PIN_ACTIONS.VERIFYING });
      const response = await fetch("/emailVerification/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pin }),
      });
      const data = await response.json();
      // if correct pin was entered
      if (data.success) {
        setImageSrc(assets.emailVerified.src);
        console.log("pin is correct");
        return;
      }
      // if email needs to be verified 
      if (data.pinLength) {
        setEmailAwaitsVerification(true);
        dispatch({
          type: PIN_ACTIONS.INITIALIZE_LENGTH,
          payload: data.pinLength,
        });
      }

      // if email does not exist, is already verified, pin is 
      // incorrect, or if email could not be verified
      if (data.message) {
        switch (data.message) {
          case "Email does not exist":
            setEmailDoesNotExist(true);
            break;
          case "Email already verified":
            setEmailAlreadyVerified(true);
            break;
          case "Incorrect email verification":
          case "Could not verify email":
            dispatch({ type: PIN_ACTIONS.DENIED });
            break;
          default:
        }
      }
      // stop rendering loading spinner for pin input
      dispatch({ type: PIN_ACTIONS.FINISHED_VERIFYING });
      // no longer fetching verification status for initial page load
      setFetchingVerificationStatus(false);
    },
    [assets.emailVerified.src]
  );

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    verifyEmail(email);
  }, [verifyEmail, email]);

  useEffect(() => {
    setImageSrc(
      emailDoesNotExist
        ? assets.emailDenied.src
        : emailAlreadyVerified || pin.verified
        ? assets.emailVerified.src
        : emailAwaitsVerification
        ? assets.emailPending.src
        : ""
    );
  }, [
    emailDoesNotExist,
    assets.emailDenied.src,
    emailAlreadyVerified,
    pin.verified,
    assets.emailVerified.src,
    emailAwaitsVerification,
    assets.emailPending.src,
  ]);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box display="grid" sx={{ placeItems: "center" }} height="100vh">
      {pageIsLoading && <Loading />}
      <Box
        p={3}
        display={pageIsLoading ? "none" : "flex"}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={phone ? 3 : 5}
      >
        <Box
          component="img"
          height={phone ? "100px" : "150px"}
          src={imageSrc}
          onLoad={() => {
            assetsDispatchers.setAllLoading(false);
            // if user inputs correct pin, first wait for the verifiedEmail image
            // to load and then dispatch the VERIFIED action to the pin reducer
            if (imageSrc === assets.emailVerified.src) {
              // stop rendering loading spinner for pin input
              dispatch({ type: PIN_ACTIONS.VERIFIED });
              // no longer fetching verification status for initial page load
              setFetchingVerificationStatus(false);
            }
          }}
        />
        {/* Header */}
        <Typography
          variant={phone ? "h4" : "h1"}
          textAlign="center"
          gutterBottom
        >
          Email Verification
        </Typography>
        {/* Body */}
        {emailAlreadyVerified ? (
          // ----------- email is already verified ------------------
          <Typography
            variant={desktop ? "h4" : tablet ? "h6" : "body2"}
            textAlign="center"
            sx={{ fontWeight: phone && 500 }}
          >
            <span style={{ color: theme.palette.primary.main }}>
              <b>{email}</b>
            </span>{" "}
            is already verified.
          </Typography>
        ) : emailDoesNotExist ? (
          // ----------------- email does not exist -----------------
          <Typography
            variant={desktop ? "h4" : tablet ? "h6" : "body2"}
            textAlign="center"
            sx={{ fontWeight: phone && 500 }}
          >
            <span style={{ color: theme.palette.primary.main }}>
              <b>{email}</b>
            </span>{" "}
            does not exist in our records.
          </Typography>
        ) : pin.verified ? (
          // --------------- pin successfully verified ---------------
          <Typography
            variant={desktop ? "h4" : tablet ? "h6" : "body2"}
            textAlign="center"
            sx={{ fontWeight: phone && 500 }}
          >
            <span style={{ color: theme.palette.primary.main }}>
              <b>{email}</b>
            </span>{" "}
            has been successfully verified.
          </Typography>
        ) : (
          // -------------------- enter email pin --------------------
          <>
            <Typography
              variant={desktop ? "h4" : tablet ? "h6" : "body2"}
              textAlign="center"
              sx={{ fontWeight: phone && 500 }}
              gutterBottom
            >
              Please enter the {pin.length} digit pin sent to{" "}
              <span style={{ color: theme.palette.primary.main }}>
                <b>{email}</b>.
              </span>
            </Typography>
            <Typography
              mt={phone ? -3 : -5}
              variant={desktop ? "h6" : tablet ? "body1" : "body2"}
              textAlign="center"
            >
              Click{" "}
              <span
                style={{ color: theme.palette.primary.main, cursor: "pointer" }}
                onClick={() => sendVerificationEmail(email)}
              >
                <b>here</b>
              </span>{" "}
              to resend verification email.
            </Typography>
            <Box
              height={desktop ? "75px" : tablet ? "75px" : "40px"}
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
            >
              {pin.verifying ? (
                <CircularProgress />
              ) : (
                <PinInput
                  length={pin.length}
                  initialValue=""
                  type="numeric"
                  inputMode="number"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: true,
                    gap: phone ? "5px" : "10px",
                  }}
                  inputStyle={{
                    border: `3px solid ${theme.palette.primary.main}`,
                    borderRadius: phone ? "7px" : "10px",
                    height: phone ? "35px" : "70px",
                    width: phone ? "35px" : "70px",
                    fontSize: phone ? "18px" : "30px",
                    fontFamily: theme.typography.fontFamily,
                  }}
                  onComplete={async (value) => {
                    dispatch({ type: PIN_ACTIONS.VERIFYING });
                    await verifyEmail(email, parseInt(value));
                  }}
                  autoSelect={true}
                  regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                />
              )}
            </Box>
            <Box
              visibility={pin.denied ? "visible" : "hidden"}
              display="flex"
              alignItems="center"
              gap={1}
              color="red"
            >
              <ErrorOutlineIcon />
              <Typography variant={phone ? "body2" : "h6"}>
                Incorrect pin
              </Typography>
            </Box>
          </>
        )}
        {/* Home Button */}
        <CustomButton variant="contained" onClick={() => navigate("/")}>
          Home
        </CustomButton>
        {/* Resend Email Verification Popup */}
        <EmailVerificationPopup
          email={email}
          sendingEmailPopup={sendingEmailPopup}
          setSendingEmailPopup={setSendingEmailPopup}
          EMAIL_VERIFICATION_POPUP_STATES={EMAIL_VERIFICATION_POPUP_STATES}
        />
      </Box>
    </Box>
  );
};

export default EmailVerification;
