import React, { useEffect, useReducer, useState } from "react";
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

// -------------------------------- COMPONENT ---------------------------------
const EmailVerification = () => {
  const { email } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { desktop, tablet, phone } = useScreenSize();
  const { assets, assetsDispatchers, loadingAssets } = useAsset({
    emailPending: { name: "email_pending" },
    emailVerified: { name: "email_verified" },
    emailDenied: { name: "email_denied" },
  });
  const [pin, dispatch] = useReducer(pinReducer, initialPinState);
  const [fetchingVerificationStatus, setFetchingVerificationStatus] =
    useState(true);
  const [emailAlreadyVerified, setEmailAlreadyVerified] = useState(false);
  const [emailDoesNotExist, setEmailDoesNotExist] = useState(false);
  const [sendingEmailPopup, setSendingEmailPopup] = useState(
    EMAIL_VERIFICATION_POPUP_STATES.CLOSED
  );

  const loading = fetchingVerificationStatus || loadingAssets;

  useEffect(() => {
    verifyEmail(email);
  }, [email]);

  const sendVerificationEmail = async (email) => {
    setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENDING);

    const response = await fetch("/signup/emailverification/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.message === "Could not send verification email") {
      return setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENT_FAILED);
    }

    return setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENT_SUCCESS);
  };

  const verifyEmail = async (email, pin) => {
    dispatch({ type: PIN_ACTIONS.VERIFYING });

    const response = await fetch("/signup/emailverification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, pin }),
    });

    const data = await response.json();

    if (data.message) {
      switch (data.message) {
        case "Email does not exist":
          setEmailDoesNotExist(true);
          break;
        case "Email already verified":
          setEmailAlreadyVerified(true);
          break;
        case "Could not verify email":
          dispatch({ type: PIN_ACTIONS.DENIED });
          break;
        case "Number of digits in pin":
          dispatch({
            type: PIN_ACTIONS.INITIALIZE_LENGTH,
            payload: data.pinLength,
          });
          break;
        default:
          break;
      }
    }

    if (data.success) dispatch({ type: PIN_ACTIONS.VERIFIED });

    dispatch({ type: PIN_ACTIONS.FINISHED_VERIFYING });
    setFetchingVerificationStatus(false);
  };

  return (
    <Box display="grid" sx={{ placeItems: "center" }} height="100vh">
      {loading && <Loading />}
      <Box
        p={3}
        display={loading ? "none" : "flex"}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={phone ? 3 : 5}
      >
        <Box
          component="img"
          height={phone ? "100px" : "150px"}
          src={
            emailDoesNotExist
              ? assets.emailDenied.src
              : emailAlreadyVerified || pin.verified
              ? assets.emailVerified.src
              : assets.emailPending.src
          }
          onLoad={() => assetsDispatchers.setAllLoading(false)}
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
