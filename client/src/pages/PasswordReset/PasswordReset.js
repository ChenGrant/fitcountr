import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect, useReducer, useState } from "react";
import CustomButton from "../../components/ui/CustomButton";
import { useTheme } from "@mui/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useScreenSize from "../../hooks/useScreenSize";
import useAsset from "../../hooks/useAsset";
import LoadingCircle from "../../components/ui/LoadingCircle";

// -------------------------------- CONSTANTS --------------------------------
const PASSWORD_RESET_EMAIL_ACTIONS = {
  SET_EMAIL: "SET_EMAIL",
  SET_IS_SENDING: "SET_IS_SENDING",
  SENT_EMAIL_SUCCESS: "SENT_EMAIL_SUCCESS",
  SET_ERROR: "SET_ERROR",
};

const TEXT_FIELD_ACTIONS = {
  SET_VALUE: "SET_VALUE",
  SET_ERROR: "SET_ERROR",
};

const passwordResetEmailReducer = (state, action) => {
  switch (action.type) {
    case PASSWORD_RESET_EMAIL_ACTIONS.SET_EMAIL:
      return { ...state, email: action.payload };
    case PASSWORD_RESET_EMAIL_ACTIONS.SET_IS_SENDING:
      return {
        ...state,
        isSending: action.payload,
      };
    case PASSWORD_RESET_EMAIL_ACTIONS.SENT_EMAIL_SUCCESS:
      return {
        ...state,
        successfullySent: true,
        error: null,
      };
    case PASSWORD_RESET_EMAIL_ACTIONS.SET_ERROR:
      return {
        ...state,
        successfullySent: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const textFieldReducer = (state, actions) => {
  switch (actions.type) {
    case TEXT_FIELD_ACTIONS.SET_VALUE:
      return { ...state, value: actions.payload };
    case TEXT_FIELD_ACTIONS.SET_ERROR:
      return { ...state, error: actions.payload };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const PasswordReset = () => {
  const auth = getAuth();
  const { desktop, tablet, phone } = useScreenSize();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const theme = useTheme();
  const [imageSrc, setImageSrc] = useState("");
  const [textField, textFieldDispatch] = useReducer(textFieldReducer, {
    value: "",
    error: "",
  });
  const [passwordResetEmail, passwordResetEmailDispatch] = useReducer(
    passwordResetEmailReducer,
    {
      email: "",
      isSending: false,
      successfullySent: false,
      error: null,
    }
  );

  const [assets, assetsDispatchers, loadingAssets] = useAsset({
    emailPending: { name: "email_pending" },
    emailVerified: { name: "email_verified" },
    emailDenied: { name: "email_denied" },
  });

  const pageIsLoading = loadingAssets;

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    setImageSrc(assets.emailPending.src);
  }, [assets.emailPending.src]);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const resetPassword = async (emailAddress) => {
    try {
      const lowerCaseEmailAddress = emailAddress.toLowerCase();

      passwordResetEmailDispatch({
        type: PASSWORD_RESET_EMAIL_ACTIONS.SET_EMAIL,
        payload: lowerCaseEmailAddress,
      });

      passwordResetEmailDispatch({
        type: PASSWORD_RESET_EMAIL_ACTIONS.SET_IS_SENDING,
        payload: true,
      });

      await sendPasswordResetEmail(auth, lowerCaseEmailAddress);

      setImageSrc(assets.emailVerified.src);
    } catch (err) {
      textFieldDispatch({
        type: TEXT_FIELD_ACTIONS.SET_ERROR,
        payload: err.message,
      });

      if (imageSrc !== assets.emailDenied.src)
        return setImageSrc(assets.emailDenied.src);
      passwordResetEmailDispatch({
        type: PASSWORD_RESET_EMAIL_ACTIONS.SET_IS_SENDING,
        payload: false,
      });
      passwordResetEmailDispatch({
        type: PASSWORD_RESET_EMAIL_ACTIONS.SET_ERROR,
        payload: err.message,
      });
    }
  };

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box height="100vh" display="grid" sx={{ placeItems: "center" }}>
      {pageIsLoading && <LoadingCircle />}
      <Box
        display={pageIsLoading ? "none" : "flex"}
        flexDirection="column"
        alignItems="center"
        gap={phone ? 3 : 5}
        p={3}
      >
        <Box
          component="img"
          height={phone ? "100px" : "150px"}
          src={imageSrc}
          onLoad={() => {
            assetsDispatchers.setAllLoading(false);
            switch (imageSrc) {
              case assets.emailVerified.src:
                passwordResetEmailDispatch({
                  type: PASSWORD_RESET_EMAIL_ACTIONS.SENT_EMAIL_SUCCESS,
                });
                break;
              case assets.emailDenied.src:
                passwordResetEmailDispatch({
                  type: PASSWORD_RESET_EMAIL_ACTIONS.SET_ERROR,
                  payload: textField.error,
                });
                break;
              default:
            }
            passwordResetEmailDispatch({
              type: PASSWORD_RESET_EMAIL_ACTIONS.SET_IS_SENDING,
              payload: false,
            });
          }}
        />
        <Typography variant={phone ? "h4" : "h1"} textAlign="center">
          {passwordResetEmail.successfullySent
            ? "Password Reset Sent"
            : "Password Reset"}
        </Typography>
        {!passwordResetEmail.successfullySent && (
          <>
            <Typography
              variant={desktop ? "h4" : tablet ? "h6" : "body2"}
              textAlign="center"
              sx={{ fontWeight: phone && 500 }}
            >
              Enter the email address you registered with.
            </Typography>
            <TextField
              value={textField.value}
              fullWidth
              placeholder="example@gmail.com"
              sx={{ maxWidth: "500px" }}
              onChange={(e) =>
                textFieldDispatch({
                  type: TEXT_FIELD_ACTIONS.SET_VALUE,
                  payload: e.target.value,
                })
              }
              onKeyDown={(event) =>
                event.key === "Enter" && resetPassword(textField.value)
              }
              label="Email Address"
            />
          </>
        )}
        <Box
          color={passwordResetEmail.error ? "red" : "black"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
          visibility={
            passwordResetEmail.error || passwordResetEmail.successfullySent
              ? "visible"
              : "hidden"
          }
        >
          {passwordResetEmail.successfullySent ? (
            <Typography
              textAlign="center"
              variant={desktop ? "h4" : tablet ? "h6" : "body2"}
              sx={{ fontWeight: phone && 500 }}
              maxWidth="900px"
            >
              Password reset email sent to{" "}
              <span style={{ color: theme.palette.primary.main }}>
                {passwordResetEmail.email}
              </span>
              . Make sure to check your spam.
            </Typography>
          ) : (
            <Typography
              variant={phone ? "body2" : "h6"}
              textAlign="center"
              sx={{ fontWeight: phone && 500 }}
            >
              {(() => {
                switch (passwordResetEmail.error) {
                  case "Firebase: Error (auth/missing-email).":
                    return "No email entered";
                  case "Firebase: Error (auth/invalid-email).":
                    return "Invalid email";
                  case "Firebase: Error (auth/user-not-found).":
                    return "Email not in use";
                  case "Firebase: Error (auth/too-many-requests).":
                    return (
                      <>
                        Too many password reset emails sent to{" "}
                        <b>{passwordResetEmail.email}</b>
                      </>
                    );
                  default:
                    return "Could not sent password reset email";
                }
              })()}
            </Typography>
          )}
        </Box>
        {passwordResetEmail.successfullySent ? (
          user.isLoggedIn ? (
            <CustomButton
              variant="contained"
              onClick={() => navigate("/dashboard/")}
            >
              Dashboard
            </CustomButton>
          ) : (
            <CustomButton variant="contained" onClick={() => navigate("/")}>
              Home
            </CustomButton>
          )
        ) : (
          <Box display="grid" sx={{ placeItems: "center" }} height="55px">
            {passwordResetEmail.isSending ? (
              <CircularProgress />
            ) : (
              <CustomButton
                onClick={() => resetPassword(textField.value)}
                variant="contained"
              >
                Reset Password
              </CustomButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PasswordReset;
