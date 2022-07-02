import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PinInput from "react-pin-input";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import useScreenSize from "../../hooks/useScreenSize";
import Loading from "./Loading";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const EMAIL_PENDING_IMAGE_SRC =
  "https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Femail%2Femail_pending.svg?alt=media&token=60a9d98a-0af3-49e2-846f-2fb2df7b7533";

const EMAIL_VERIFIED_IMAGE_SRC =
  "https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Femail%2Femail_verified.svg?alt=media&token=1ce048b8-24bf-4d25-a229-3adac6724549";

const EMAIL_DENIED_IMAGE_SRC =
  "https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Femail%2Femail_denied.svg?alt=media&token=7ddd7136-fb54-4558-9c51-0b357aa58737";

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

const EmailVerification = () => {
  const { email } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { desktop, tablet, phone } = useScreenSize();

  const [pin, dispatch] = useReducer(pinReducer, initialPinState);

  const [loading, setLoading] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [emailAlreadyVerified, setEmailAlreadyVerified] = useState(false);
  const [emailDoesNotExist, setEmailDoesNotExist] = useState(false);

  useEffect(() => {
    verifyEmail(email);
  }, [email]);

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
    setLoading(false);
  };

  return (
    <>
      {(loading || loadingAssets) && <Loading />}
      <Box
        p={3}
        pt="15vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={phone ? 3 : 5}
      >
        <Box
          component="img"
          height={phone ? "100px" : "200px"}
          src={
            emailDoesNotExist
              ? EMAIL_DENIED_IMAGE_SRC
              : emailAlreadyVerified || pin.verified
              ? EMAIL_VERIFIED_IMAGE_SRC
              : EMAIL_PENDING_IMAGE_SRC
          }
          onLoad={() => setLoadingAssets(false)}
        />
        <Typography variant={phone ? "h4" : "h1"} textAlign="center">
          Email Verification
        </Typography>
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
            >
              Please enter the {pin.length} digit pin sent to{" "}
              <span style={{ color: theme.palette.primary.main }}>
                <b>{email}</b>.
              </span>{" "}
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
        <Button
          sx={{ textTransform: "none", color: "white" }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Home
        </Button>
      </Box>
    </>
  );
};

export default EmailVerification;
