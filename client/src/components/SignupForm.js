import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import FormikControl from "./formik/FormikControl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GoogleIcon from "@mui/icons-material/Google";
import { useTheme } from "@emotion/react";
import useScreenSize from "../hooks/useScreenSize";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// -------------------------------------- CONSTANTS --------------------------------------
const FORM_ERROR_HEIGHT = "15px";

const EMAIL_ALREADY_IN_USE = "Email already in use";

const GMAIL_SIGN_IN_METHOD = "gmail as sign in method";

const EMAIL_PASSWORD_SIGN_IN_METHOD = "email and password as sign in method";

const BUTTON_STYLING = {
  borderRadius: "10px",
  textTransform: "none",
  color: "white",
};

// -------------------------------------- FUNCTIONS --------------------------------------
// given a the name attribute of an input field, fieldName, and the
// formik object, errorIsRendered returns true if there is an error
// being rendered for the input field with a name attribute of fieldName
// and false otherwise
const errorIsRendered = (fieldName, formik) =>
  formik.errors[fieldName] && formik.touched[fieldName];

// ***************************************************************************************
// -------------------------------------- COMPONENT --------------------------------------
// ***************************************************************************************
const SignupForm = ({ toggleForm }) => {
  // ------ HOOKS ------
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [password2IsVisible, setPassword2IsVisible] = useState(false);
  const [signupButtonIsDisabled, setSignupButtonIsDisabled] = useState(false);
  const theme = useTheme();
  const auth = useSelector((state) => state.firebaseClient.auth);
  const navigate = useNavigate();
  const { desktop, tablet } = useScreenSize();

  // ------ FORMIK ------
  const initialValues = {
    email: "",
    password: "",
    password2: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Required")
      .email("Email must be a valid email address"),
    password: Yup.string()
      .required("Required")
      .min(8, "Password must be at 8 characters."),
    password2: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const onSubmit = async ({ email, password }, formik) => {
    setSignupButtonIsDisabled(true);
    await handleEmailPasswordSignup(email, password, formik);
    setSignupButtonIsDisabled(false);
  };

  // ------ FUNCTIONS ------
  // given a user object and a signInMethod string, a POST request
  // is sent to the server to the '/signup' endpoint and this function
  // returns the json data that the server responds with
  const sendSignupRequest = async (user, signInMethod) => {
    const userIdToken = await user.getIdToken();
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: userIdToken,
      },
      body: JSON.stringify({
        user,
        signInMethod,
        constants: {
          EMAIL_ALREADY_IN_USE,
          GMAIL_SIGN_IN_METHOD,
          EMAIL_PASSWORD_SIGN_IN_METHOD,
        },
      }),
    });
    const data = await response.json();
    return data;
  };

  // handleGmailSignup signs in the user via their gmail account and
  // creates an account for them if it is their first time signing in
  const handleGmailSignup = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const { user } = result;
    const data = await sendSignupRequest(user, GMAIL_SIGN_IN_METHOD);
    // if there is an authentication or authorization error
    if (data.message) return;
  };

  // handleEmailPasswordSignup uses the given  email string, password string,
  // and the formik object to either create a new user or render signup errors
  const handleEmailPasswordSignup = async (email, password, formik) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      const data = await sendSignupRequest(user, EMAIL_PASSWORD_SIGN_IN_METHOD);
      // if there is an authentication or authorization error
      if (data.message) return;
      // if there was an error with the form
      if (data.formErrors) {
        Object.entries(data.formErrors).forEach(({ fieldName, fieldError }) => {
          formik.setFieldError(fieldName, fieldError);
        });
        return;
      }
      console.log("verification email sent");
      navigate(`/emailverification/${email}`);
      // redirect user to verification email page
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        formik.setFieldError("email", EMAIL_ALREADY_IN_USE);
      }
    }
  };

  // ------ RENDER ------
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: "13px",
        width: desktop ? "545px" : tablet ? "90%" : "auto",
      }}
      raised
    >
      <Box width="100%">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Typography variant="h1" gutterBottom textAlign="center">
                    Signup
                  </Typography>
                  {/* "Login with Gmail" button */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={BUTTON_STYLING}
                    onClick={handleGmailSignup}
                    startIcon={
                      <GoogleIcon
                        sx={{ transform: "scale(1.5)", marginRight: "20px" }}
                      />
                    }
                  >
                    Signup with Gmail
                  </Button>
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
                  {/* confirm password input field */}
                  <Box
                    mb={
                      !errorIsRendered("password2", formik) && FORM_ERROR_HEIGHT
                    }
                  >
                    <FormikControl
                      control="input"
                      label="Confirm Password"
                      name="password2"
                      type={!password2IsVisible ? "password" : ""}
                      errorHeight={FORM_ERROR_HEIGHT}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setPassword2IsVisible(!password2IsVisible)
                            }
                          >
                            {password2IsVisible ? (
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
                  {/* Login button */}
                  <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ height: "56px" }}
                  >
                    {signupButtonIsDisabled ? (
                      <CircularProgress />
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={BUTTON_STYLING}
                      >
                        Signup
                      </Button>
                    )}
                  </Box>
                  {/* Get started */}
                  <Box>
                    <Typography display="inline">
                      Already have an account?{" "}
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
                      Login
                    </Typography>
                  </Box>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Card>
  );
};

export default SignupForm;
