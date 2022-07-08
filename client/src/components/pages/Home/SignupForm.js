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
import useScreenSize from "../../../hooks/useScreenSize";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../mui/CustomButton";
import GmailOverridePopup from "./GmailOverridePopup";

// -------------------------------------- CONSTANTS --------------------------------------
const FORM_ERROR_HEIGHT = "15px";

const EMAIL_ALREADY_IN_USE = "Email already in use";

const GMAIL_PROVIDER = "GMAIL_PROVIDER";

const EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER";

// given a the name attribute of an input field, fieldName, and the
// formik object, errorIsRendered returns true if there is an error
// being rendered for the input field with a name attribute of fieldName
// and false otherwise
const errorIsRendered = (fieldName, formik) =>
  formik.errors[fieldName] && formik.touched[fieldName];

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SignupForm = ({ toggleForm }) => {
  const theme = useTheme();
  const auth = useSelector((state) => state.firebaseClient.auth);
  const navigate = useNavigate();
  const { desktop, tablet } = useScreenSize();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [password2IsVisible, setPassword2IsVisible] = useState(false);
  const [passwordSignupButtonIsDisabled, setPasswordSignupButtonIsDisabled] =
    useState(false);
  const [gmailSignupButtonIsDisabled, setGmailSignupButtonIsDisabled] =
    useState(false);
  const [gmailOverridePopupIsOpen, setGmailOverridePopupIsOpen] =
    useState(false);
  // overriddenGmailAddress is the gmail address of the account whose email 
  // verification provider got overridden to use gmail
  const [overriddenGmailAddress, setOverriddenGmailAddress] = useState("");

  // ------------------------------------- FORMIK -------------------------------------
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
    setPasswordSignupButtonIsDisabled(true);
    await handleEmailPasswordSignup(email, password, formik);
    setPasswordSignupButtonIsDisabled(false);
  };

  // ----------------------------------- FUNCTIONS -----------------------------------
  // given a user object and a email verification provider string, a POST 
  // request is sent to the server to the '/signup' endpoint and this function
  // returns the json data that the server responds with
  const sendSignupRequest = async (user, provider) => {
    const userIdToken = await user.getIdToken();
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: userIdToken,
      },
      body: JSON.stringify({
        user,
        provider,
      }),
    });
    const data = await response.json();
    return data;
  };

  // handleGmailSignup signs in the user via their gmail account,
  // creates an account for them if it is their first time signing in.
  // If an account associated with the gmail already exists, the login
  // method will be overridden to use gmail.
  const handleGmailSignup = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const { user } = result;
    setGmailSignupButtonIsDisabled(true);
    const data = await sendSignupRequest(user, GMAIL_PROVIDER);
    setGmailSignupButtonIsDisabled(false);
    if (data.message) {
      switch (data.message) {
        case "Provider overridden to now use Gmail":
          setOverriddenGmailAddress(user.email);
          setGmailOverridePopupIsOpen(true);
          return;
        default:
          break;
      }
    }
  };

  // handleEmailPasswordSignup uses the given  email string, password string,
  // and the formik object to either create a new user or render signup errors
  const handleEmailPasswordSignup = async (email, password, formik) => {
    try {
      // create user in firebase client authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;
      const data = await sendSignupRequest(user, EMAIL_PASSWORD_PROVIDER);
      // if there was an error with the form
      if (data.formErrors) {
        Object.entries(data.formErrors).forEach(({ fieldName, fieldError }) => {
          formik.setFieldError(fieldName, fieldError);
        });
        return;
      }
      // redirect user to verification email page
      navigate(`/emailverification/${email}`);
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        formik.setFieldError("email", EMAIL_ALREADY_IN_USE);
      }
    }
  };

  // ------------------------------------- RENDER -------------------------------------
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
                  <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ height: "56px" }}
                  >
                    {gmailSignupButtonIsDisabled ? (
                      <CircularProgress />
                    ) : (
                      <CustomButton
                        fullWidth
                        variant="contained"
                        onClick={handleGmailSignup}
                        startIcon={
                          <GoogleIcon
                            sx={{
                              transform: "scale(1.5)",
                              marginRight: "20px",
                            }}
                          />
                        }
                      >
                        Signup with Gmail
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
                    {passwordSignupButtonIsDisabled ? (
                      <CircularProgress />
                    ) : (
                      <CustomButton type="submit" variant="contained" fullWidth>
                        Signup
                      </CustomButton>
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
                  {/* Gmail override popup */}
                  <GmailOverridePopup
                    gmailOverridePopupIsOpen={gmailOverridePopupIsOpen}
                    overriddenGmailAddress={overriddenGmailAddress}
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

export default SignupForm;
