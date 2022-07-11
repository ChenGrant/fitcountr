import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import FormikControl from "../../formik/FormikControl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GoogleIcon from "@mui/icons-material/Google";
import { useTheme } from "@emotion/react";
import CustomButton from "../../../mui/CustomButton";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  fetchEmailProvider,
  fetchVerificationStatus,
  handleAuthWithGmail,
} from "../../../utils";
import { resetUser, setUser, setVerificationStatus } from "../../../redux";
import { useNavigate } from "react-router-dom";
import GmailOverridePopup from "./GmailOverridePopup";
import {
  GMAIL_PROVIDER,
  FORM_ERROR_HEIGHT,
  errorIsRendered,
} from "../../../utils";

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
const LoginForm = ({ toggleForm }) => {
  const auth = getAuth();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [gmailLoginButtonIsDisabled, setGmailLoginButtonIsDisabled] =
    useState(false);
  const [passwordLoginButtonIsDisabled, setPasswordLoginButtonIsDisabled] =
    useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [gmailOverridePopupIsOpen, setGmailOverridePopupIsOpen] =
    useState(false);
  //const [overriddenGmailAddress, setOverriddenGmailAddress] = useState("");
  const [overriddenGmailUser, setOverriddenGmailUser] = useState();

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleLoginWithEmailAndPassword = async (email, password, formik) => {
    try {
      const fetchedEmailProvider = await fetchEmailProvider(email);
      if (fetchedEmailProvider.emailProvider === GMAIL_PROVIDER)
        throw new Error("Login attempt via password when provider is Gmail");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(resetUser());
      const { user } = userCredential;
      dispatch(setUser(user));
      const fetchedVerificationStatus = await fetchVerificationStatus(email);
      if (fetchedVerificationStatus.error)
        return console.log(fetchedVerificationStatus.error);
      switch (fetchedVerificationStatus.verificationStatus) {
        case "Verified":
          dispatch(setVerificationStatus("Verified"));
          navigate("/dashboard");
          return;
        case "Not verified":
          dispatch(setVerificationStatus("Not verified"));
          navigate(`/emailVerification/${user.email}`);
          return;
        default:
          break;
      }
    } catch (error) {
      switch (error.message) {
        case "Login attempt via password when provider is Gmail":
          return formik.setFieldError("email", "Account uses Gmail login");
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
      }}
      raised
    >
      <Box width="100%">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async ({ email, password }, formik) => {
            setPasswordLoginButtonIsDisabled(true);
            await handleLoginWithEmailAndPassword(email, password, formik);
            setPasswordLoginButtonIsDisabled(false);
          }}
        >
          {(formik) => {
            return (
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
                          setGmailLoginButtonIsDisabled(true);
                          await handleAuthWithGmail({
                            auth,
                            dispatch,
                            navigate,
                            setOverriddenGmailUser,
                            setGmailOverridePopupIsOpen,
                          });
                          setGmailLoginButtonIsDisabled(false);
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
                    Login as guest with email: <b>guest@guest.ca</b> and
                    password: <b>guest123</b>
                  </Typography>
                  {/* email input field */}
                  <Box
                    mb={!errorIsRendered("email", formik) && FORM_ERROR_HEIGHT}
                  >
                    <FormikControl
                      control="input"
                      label="Email"
                      name="email"
                      errorHeight={FORM_ERROR_HEIGHT}
                    />
                  </Box>
                  {/* password input field */}
                  <Box
                    mb={
                      !errorIsRendered("password", formik) && FORM_ERROR_HEIGHT
                    }
                  >
                    <FormikControl
                      control="input"
                      label="Password"
                      name="password"
                      type={!passwordIsVisible ? "password" : ""}
                      errorHeight={FORM_ERROR_HEIGHT}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setPasswordIsVisible(!passwordIsVisible)
                            }
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
                  </Box>
                  {/* 'forgot password' text */}
                  <Box fullWidth>
                    <Typography
                      textAlign="right"
                      sx={{ cursor: "pointer", fontWeight: 600 }}
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
                  {/* Gmail override popup */}
                  <GmailOverridePopup
                    gmailOverridePopupIsOpen={gmailOverridePopupIsOpen}
                    overriddenGmailUser={overriddenGmailUser}
                  />
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Card>
  );
};

export default LoginForm;
