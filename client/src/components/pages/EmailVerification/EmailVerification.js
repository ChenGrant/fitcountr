import { useTheme } from "@mui/styles";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAsset from "../../../hooks/useAsset";
import useScreenSize from "../../../hooks/useScreenSize";
import { Box, CircularProgress, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PinInput from "react-pin-input";
import EmailVerificationPopup from "./EmailVerificationPopup";
import CustomButton from "../../ui/CustomButton";
import {
  fetchEmailIsInUse,
  fetchVerificationStatus,
  fetchPinLength,
  sendVerificationEmail,
  fetchValidatePin,
} from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setVerificationStatus } from "../../../redux";
import LoadingCircle from "../../ui/LoadingCircle";

// -------------------------------- CONSTANTS --------------------------------
const EMAIL_VERIFICATION_POPUP_STATES = {
  CLOSED: "CLOSED",
  SENDING: "SENDING",
  SENT_SUCCESS: "SENT_SUCCESS",
  SENT_FAILED: "SENT_FAILED",
};

const PIN_ACTIONS = {
  VALIDATING: "VALIDATING",
  VERIFIED: "VERIFIED",
  DENIED: "DENIED",
  INITIALIZE_LENGTH: "INITIALIZE_LENGTH",
};

const initialPinState = {
  validating: false,
  verified: false,
  denied: false,
  length: null,
};

const pinReducer = (state, action) => {
  switch (action.type) {
    case PIN_ACTIONS.VALIDATING:
      return { ...state, validating: true };
    case PIN_ACTIONS.VERIFIED:
      return { ...state, validating: false, verified: true, denied: false };
    case PIN_ACTIONS.DENIED:
      return { ...state, validating: false, verified: false, denied: true };
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
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [assets, assetsDispatchers, loadingAssets, fetchingAssetSources] =
    useAsset({
      emailPending: { name: "email_pending" },
      emailVerified: { name: "email_verified" },
      emailDenied: { name: "email_denied" },
    });
  const [pin, pinDispatch] = useReducer(pinReducer, initialPinState);
  const [imageSrc, setImageSrc] = useState("");
  const [emailVerificationPopup, setEmailVerificationPopup] = useState(
    EMAIL_VERIFICATION_POPUP_STATES.CLOSED
  );
  // initial value of null, then true or false depending on api response
  const [emailIsInUse, setEmailIsInUse] = useState();
  // initial value of null, then true or false depending on api response
  const [emailIsVerified, setEmailIsVerified] = useState();
  const [initializingPageData, setInitializingPageData] = useState(true);
  // when true, loading spinner for pin validation is rendered
  const [handlingPinValidation, setHandlingPinValidation] = useState(false);

  const pageIsLoading = initializingPageData || loadingAssets;

  // ----------------------------------- FUNCTIONS -----------------------------------
  const sendVerificationEmailHandler = async () => {
    setEmailVerificationPopup(EMAIL_VERIFICATION_POPUP_STATES.SENDING);
    const responseData = await sendVerificationEmail(email);
    if (responseData.error) {
      console.log(responseData.error.message);
      setEmailVerificationPopup(EMAIL_VERIFICATION_POPUP_STATES.SENT_FAILED);
      return;
    }
    switch (responseData.message) {
      case "Verification email sent":
        setEmailVerificationPopup(EMAIL_VERIFICATION_POPUP_STATES.SENT_SUCCESS);
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

    pinDispatch({ type: PIN_ACTIONS.VALIDATING });
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
        pinDispatch({ type: PIN_ACTIONS.DENIED });
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
                return;
              }

              if (fetchedPinLength.pinLength !== undefined) {
                pinDispatch({
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

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box display="grid" sx={{ placeItems: "center" }} height="100vh">
      {pageIsLoading && <LoadingCircle />}
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
              if (user.user && user.user.email === email)
                dispatch(setVerificationStatus("Verified"));

              if (pin.validating) {
                pinDispatch({ type: PIN_ACTIONS.VERIFIED });
                setEmailIsVerified(true);
                setHandlingPinValidation(false);
                return;
              }

              if (!pin.validating) {
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
        {emailIsInUse === undefined ||
        (emailIsInUse && emailIsVerified === undefined) ? (
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
        {/* Home Button, make it display 'proceed to dashboard' if user is logged in and email verified */}
        {user.isLoggedIn && user.user.email === email ? (
          <CustomButton
            variant="contained"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </CustomButton>
        ) : (
          <CustomButton variant="contained" onClick={() => navigate("/")}>
            Home
          </CustomButton>
        )}
        <EmailVerificationPopup
          email={email}
          sendingEmailPopup={emailVerificationPopup}
          setEmailVerificationPopup={setEmailVerificationPopup}
          EMAIL_VERIFICATION_POPUP_STATES={EMAIL_VERIFICATION_POPUP_STATES}
        />
      </Box>
    </Box>
  );
};

export default EmailVerification;
