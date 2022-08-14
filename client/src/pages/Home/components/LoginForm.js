import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import FormikControl from "../../../components/formik/FormikControl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GoogleIcon from "@mui/icons-material/Google";
import { useTheme } from "@emotion/react";
import CustomButton from "../../../components/ui/CustomButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchEmailIsInUse,
  fetchEmailProvider,
  fetchVerificationStatus,
  GMAIL_PROVIDER,
} from "../../../utils";
import { setAuthenticatingUser } from "../../../redux";
import useScreenSize from "../../../hooks/useScreenSize";
import { handleAuthWithGmail } from "../utils";
import { ROUTE_PATHS } from "../../../setup/routes/routeUtils";

// ---------------------------------------- FORMIK ----------------------------------------
const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Required")
    .email("Email must be a valid email address"),
  password: Yup.string().required("Required"),
});

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const LoginForm = ({
  toggleForm,
  setGmailOverridePopupState,
  setOverriddenGmailUser,
}) => {
  const auth = getAuth();
  const theme = useTheme();
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { desktop, tablet } = useScreenSize();
  const [gmailLoginButtonIsDisabled, setGmailLoginButtonIsDisabled] =
    useState(false);
  const [passwordLoginButtonIsDisabled, setPasswordLoginButtonIsDisabled] =
    useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleLoginWithEmailAndPassword = async (email, password, formik) => {
    try {
      const fetchedEmailIsInUse = await fetchEmailIsInUse(email);
      if (!fetchedEmailIsInUse.emailIsInUse)
        throw new Error("Email not in use");

      const fetchedEmailProvider = await fetchEmailProvider(email);
      if (fetchedEmailProvider.emailProvider === GMAIL_PROVIDER)
        throw new Error("Login attempt via password when provider is Gmail");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = userCredential.user;

      if (user.firebase === newUser && user.auth.isVerified !== null) {
        return user.auth.isVerified
          ? navigate(ROUTE_PATHS.DASHBOARD)
          : navigate(`${ROUTE_PATHS.EMAIL_VERIFICATION}/${newUser.email}`);
      }

      const fetchedVerificationStatus = await fetchVerificationStatus(email);
      if (fetchedVerificationStatus.error)
        return console.log(fetchedVerificationStatus.error);
      switch (fetchedVerificationStatus.verificationStatus) {
        case "Verified":
          return navigate(ROUTE_PATHS.DASHBOARD);
        case "Not verified":
          return navigate(`${ROUTE_PATHS.EMAIL_VERIFICATION}/${newUser.email}`);
        default:
          return;
      }
    } catch (err) {
      switch (err.message) {
        case "Login attempt via password when provider is Gmail":
          return formik.setFieldError("email", "Account uses Gmail login");
        case "Email not in use":
        case "Firebase: Error (auth/user-not-found).":
          return formik.setFieldError("email", "Email not in use");
        case "Firebase: Error (auth/wrong-password).":
          return formik.setFieldError("password", "Incorrect password");
        default:
          break;
      }
    }
  };

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: "13px",
        width: desktop ? "545px" : tablet ? "90%" : "85%",
      }}
      raised
    >
      <Box width="100%">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async ({ email, password }, formik) => {
            setPasswordLoginButtonIsDisabled(true);
            await handleLoginWithEmailAndPassword(
              email.toLowerCase(),
              password,
              formik
            );
            setPasswordLoginButtonIsDisabled(false);
          }}
        >
          <Form>
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography variant="h1" gutterBottom textAlign="center">
                Login
              </Typography>
              {/* "Login with Gmail" button */}
              <Box
                display="flex"
                justifyContent="center"
                sx={{ height: "56px" }}
              >
                {gmailLoginButtonIsDisabled ? (
                  <CircularProgress />
                ) : (
                  <CustomButton
                    fullWidth
                    variant="contained"
                    onClick={async () => {
                      dispatch(setAuthenticatingUser(true));
                      await handleAuthWithGmail(
                        auth,
                        setOverriddenGmailUser,
                        setGmailOverridePopupState,
                        setGmailLoginButtonIsDisabled
                      );
                      dispatch(setAuthenticatingUser(false));
                    }}
                    startIcon={
                      <GoogleIcon
                        sx={{
                          transform: "scale(1.5)",
                          marginRight: "20px",
                        }}
                      />
                    }
                  >
                    Login with Gmail
                  </CustomButton>
                )}
              </Box>
              {/* login form divider */}
              <Box
                my={1}
                fullWidth
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Box height="1px" flex={1} bgcolor="#B3B3B3" />
                <Typography variant="h6" mx={2} sx={{ color: "#B3B3B3" }}>
                  or
                </Typography>
                <Box height="1px" flex={1} bgcolor="#B3B3B3" />
              </Box>
              {/* guest login credentials */}
              <Typography color="primary" textAlign="center">
                Login as guest with email: <b>guest@guest.ca</b> and password:{" "}
                <b>guest123</b>
              </Typography>
              {/* email input field */}
              <FormikControl control="input" label="Email" name="email" />
              {/* password input field */}
              <FormikControl
                control="input"
                label="Password"
                name="password"
                type={!passwordIsVisible ? "password" : ""}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setPasswordIsVisible(!passwordIsVisible)}
                    >
                      {passwordIsVisible ? (
                        <VisibilityIcon
                          sx={{ color: theme.palette.primary.main }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          sx={{ color: theme.palette.primary.main }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {/* 'forgot password' text */}
              <Box fullWidth>
                <Typography
                  onClick={() => navigate(ROUTE_PATHS.PASSWORD_RESET)}
                  textAlign="right"
                  sx={{
                    cursor: "pointer",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  color="primary"
                >
                  Forgot password?
                </Typography>
              </Box>
              {/* Login button */}
              <Box
                display="flex"
                justifyContent="center"
                sx={{ height: "56px" }}
              >
                {passwordLoginButtonIsDisabled ? (
                  <CircularProgress />
                ) : (
                  <CustomButton type="submit" variant="contained" fullWidth>
                    Login
                  </CustomButton>
                )}
              </Box>
              {/* Get started */}
              <Box>
                <Typography display="inline">
                  Don't have an account?{" "}
                </Typography>
                <Typography
                  display="inline"
                  color="primary"
                  sx={{
                    cursor: "pointer",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={toggleForm}
                >
                  Signup
                </Typography>
              </Box>
            </Box>
          </Form>
        </Formik>
      </Box>
    </Card>
  );
};

export default LoginForm;
