import { useTheme } from "@mui/styles";
import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import useAsset from "../../../hooks/useAsset";
import useScreenSize from "../../../hooks/useScreenSize";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import Loading from "../Loading/Loading";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PinInput from "react-pin-input";
import EmailVerificationPopup from "./EmailVerificationPopup";

// -------------------------------- CONSTANTS --------------------------------
const EMAIL_VERIFICATION_POPUP_STATES = {
  CLOSED: "CLOSED",
  SENDING: "SENDING",
  SENT_SUCCESS: "SENT_SUCCESS",
  SENT_FAILED: "SENT_FAILED",
};

const FETCH_PIN_LENGTH_FAILED_LENGTH = -1;

const PIN_ACTIONS = {
  VERIFYING: "VERIFYING",
  VERIFIED: "VERIFIED",
  DENIED: "DENIED",
  INITIALIZE_LENGTH: "INITIALIZE_LENGTH",
  FETCH_LENGTH_FAILED: "FETCH_LENGTH_FAILED",
};

const initialPinState = {
  verifying: false,
  verified: false,
  denied: false,
  length: null,
};

const pinReducer = (state, action) => {
  switch (action.type) {
    case PIN_ACTIONS.VERIFYING:
      return { ...state, verifying: true };
    case PIN_ACTIONS.VERIFIED:
      return { ...state, verifying: false, verified: true, denied: false };
    case PIN_ACTIONS.DENIED:
      return { ...state, verifying: false, verified: false, denied: true };
    case PIN_ACTIONS.INITIALIZE_LENGTH:
      return { ...state, length: action.payload };
    case PIN_ACTIONS.FETCH_LENGTH_FAILED:
      return { ...state, length: FETCH_PIN_LENGTH_FAILED_LENGTH };
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
  const { desktop, tablet, phone } = useScreenSize();
  const [assets, assetsDispatchers, loadingAssets, fetchingAssetSources] =
    useAsset({
      emailPending: { name: "email_pending" },
      emailVerified: { name: "email_verified" },
      emailDenied: { name: "email_denied" },
    });
  const loadingFonts = useSelector((state) => state.fonts.loading);
  const [pin, dispatch] = useReducer(pinReducer, initialPinState);
  const [imageSrc, setImageSrc] = useState("");
  const [sendingEmailPopup, setSendingEmailPopup] = useState(
    EMAIL_VERIFICATION_POPUP_STATES.CLOSED
  );
  // initial value of null, then true or false depending on api response
  const [emailIsInUse, setEmailIsInUse] = useState();
  // initial value of null, then true or false depending on api response
  const [emailIsVerified, setEmailIsVerified] = useState();
  const [initializingPageData, setInitializingPageData] = useState(true);
  const [handlingPinValidation, setHandlingPinValidation] = useState(false);

  const pageIsLoading = initializingPageData || loadingAssets || loadingFonts;

  // ----------------------------------- FUNCTIONS -----------------------------------
  const fetchEmailIsInUse = async (email) => {
    const response = await fetch(`/emailVerification/emailInUse/${email}`);
    const data = await response.json();
    return data;
  };

  const fetchVerificationStatus = async (email) => {
    const response = await fetch(
      `/emailVerification/verificationStatus/${email}`
    );
    const data = await response.json();
    return data;
  };

  const fetchPinLength = async (email) => {
    const response = await fetch(`/emailVerification/pinLength/${email}`);
    const data = await response.json();
    return data;
  };

  const fetchSendVerificationEmail = async (email) => {
    const response = await fetch(
      `/emailVerification/sendVerificationEmail/${email}`,
      { method: "POST" }
    );
    const data = await response.json();
    return data;
  };

  const fetchValidatePin = async (email, pin) => {
    const response = await fetch("/emailVerification/validatePin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, pin }),
    });
    const data = await response.json();
    return data;
  };

  const sendVerificationEmailHandler = async () => {
    setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENDING);
    const responseData = await fetchSendVerificationEmail(email);
    if (responseData.error) {
      console.log(responseData.error.message);
      setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENT_FAILED);
      return;
    }
    switch (responseData.message) {
      case "Verification email sent":
        setSendingEmailPopup(EMAIL_VERIFICATION_POPUP_STATES.SENT_SUCCESS);
        return;
      default:
        break;
    }
  };

  const validatePinHandler = async (enteredPin) => {
    setHandlingPinValidation(true);
    // check if email is already verified
    const fetchedVerificationStatus = await fetchVerificationStatus(email);
    if (fetchedVerificationStatus.verificationStatus === "Verified") {
      setImageSrc(assets.emailVerified.src);
      return;
    }

    dispatch({ type: PIN_ACTIONS.VERIFYING });
    const responseData = await fetchValidatePin(email, parseInt(enteredPin));
    if (responseData.error) {
      console.log(responseData.error.message);
      return;
      // handle the case where pin was unable to be validated
    }
    switch (responseData.message) {
      case "Pin is valid":
        setImageSrc(assets.emailVerified.src);
        return;
      case "Pin is invalid":
        dispatch({ type: PIN_ACTIONS.DENIED });
        break;
      default:
        break;
    }
    setHandlingPinValidation(false);
  };

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    !fetchingAssetSources &&
      (async () => {
        await (async () => {
          // determining if email is in use
          const fetchedEmailIsInUse = await fetchEmailIsInUse(email);
          if (fetchedEmailIsInUse.error) {
            console.log(fetchedEmailIsInUse.error);
            setImageSrc(assets.emailDenied.src);
            return;
          }
          if (!fetchedEmailIsInUse.emailIsInUse) {
            setImageSrc(assets.emailDenied.src);
            setEmailIsInUse(false);
            return;
          }
          setEmailIsInUse(true);

          // determine verification status of email
          const fetchedVerificationStatus = await fetchVerificationStatus(
            email
          );
          if (fetchedVerificationStatus.error) {
            console.log(fetchedVerificationStatus.error);
            setImageSrc(assets.emailDenied.src);
            return;
          }
          switch (fetchedVerificationStatus.verificationStatus) {
            case "Verified":
              setEmailIsVerified(true);
              setImageSrc(assets.emailVerified.src);
              return;
            case "Not verified":
              const fetchedPinLength = await fetchPinLength(email);
              setEmailIsVerified(false);
              if (fetchedPinLength.error) {
                console.log(fetchedPinLength.error);
                setImageSrc(assets.emailDenied.src);
                dispatch({ type: PIN_ACTIONS.FETCH_LENGTH_FAILED });
                return;
              }

              if (fetchedPinLength.pinLength !== undefined) {
                dispatch({
                  type: PIN_ACTIONS.INITIALIZE_LENGTH,
                  payload: fetchedPinLength.pinLength,
                });
                setImageSrc(assets.emailPending.src);
                return;
              }
              break;
            default:
              break;
          }
        })();
        setInitializingPageData(false);
      })();
  }, [
    email,
    fetchingAssetSources,
    assets.emailVerified.src,
    assets.emailPending.src,
    assets.emailDenied.src,
  ]);

  useEffect(() => {
    console.log(initializingPageData, loadingAssets, loadingFonts);
  }, [initializingPageData, loadingAssets, loadingFonts]);

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
            if (imageSrc === assets.emailVerified.src) {
              if (pin.verifying) {
                dispatch({ type: PIN_ACTIONS.VERIFIED });
                setEmailIsVerified(true);
                setHandlingPinValidation(false);
                return;
              }
              if (!pin.verifying) {
                setEmailIsVerified(true);
                setHandlingPinValidation(false);
                return;
              }
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
        {emailIsInUse === undefined || emailIsVerified === undefined ? (
          <Typography
            variant={desktop ? "h4" : tablet ? "h6" : "body2"}
            textAlign="center"
            sx={{ fontWeight: phone && 500 }}
          >
            Unable to verify
            <b style={{ color: theme.palette.primary.main }}> {email}</b>, try
            again later.
          </Typography>
        ) : !emailIsInUse ? (
          <Typography
            variant={desktop ? "h4" : tablet ? "h6" : "body2"}
            textAlign="center"
            sx={{ fontWeight: phone && 500 }}
          >
            <b style={{ color: theme.palette.primary.main }}>{email}</b> is not
            in use.
          </Typography>
        ) : emailIsVerified && !pin.verified ? (
          <Typography
            variant={desktop ? "h4" : tablet ? "h6" : "body2"}
            textAlign="center"
            sx={{ fontWeight: phone && 500 }}
          >
            <b style={{ color: theme.palette.primary.main }}> {email} </b> is
            already verified.
          </Typography>
        ) : emailIsVerified ? (
          <Typography
            variant={desktop ? "h4" : tablet ? "h6" : "body2"}
            textAlign="center"
            sx={{ fontWeight: phone && 500 }}
          >
            <b style={{ color: theme.palette.primary.main }}> {email} </b> has
            been successfully verified.
          </Typography>
        ) : (
          <>
            <Typography
              variant={desktop ? "h4" : tablet ? "h6" : "body2"}
              textAlign="center"
              sx={{ fontWeight: phone && 500 }}
              gutterBottom
            >
              Please enter the {pin.length} digit pin sent to{" "}
              <b style={{ color: theme.palette.primary.main }}>{email}</b>.
            </Typography>
            <Typography
              mt={phone ? -3 : -5}
              variant={desktop ? "h6" : tablet ? "body1" : "body2"}
              textAlign="center"
            >
              Click{" "}
              <b
                style={{ color: theme.palette.primary.main, cursor: "pointer" }}
                onClick={sendVerificationEmailHandler}
              >
                here
              </b>{" "}
              to resend verification email.
            </Typography>
            <Box
              height={desktop ? "75px" : tablet ? "75px" : "40px"}
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
            >
              {handlingPinValidation ? (
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
                  onComplete={validatePinHandler}
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
