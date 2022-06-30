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
import { useDispatch, useSelector } from "react-redux";
import { signInUser } from "../redux";

// -------------------------------------- CONSTANTS --------------------------------------
const INPUT_FIELD_ERROR_MESSAGE_HEIGHT = "15px";

const FIREBASE_EMAIL_IN_USE = "Firebase: Error (auth/email-already-in-use).";

const EMAIL_ALREADY_IN_USE = "Email already in use";

const BUTTON_STYLING = {
  borderRadius: "10px",
  textTransform: "none",
  color: "white",
};

// given a the name attribute of an input field, fieldName, and the
// formik object, errorIsRendered returns true if there is an error
// being rendered for the input field with a name attribute of fieldName
const errorIsRendered = (fieldName, formik) =>
  formik.errors[fieldName] && formik.touched[fieldName];

// -------------------------------------- COMPONENT --------------------------------------
const SignupForm = ({ toggleForm }) => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [password2IsVisible, setPassword2IsVisible] = useState(false);
  const [signupButtonIsDisabled, setSignupButtonIsDisabled] = useState(false);

  const theme = useTheme();
  const auth = useSelector((state) => state.firebaseClient.auth);
  const dispatch = useDispatch();
  const { desktop, tablet } = useScreenSize();

  // -------------------------------------- FORMIK --------------------------------------
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
    await handleEmailPasswordSignup(email, password, formik);
  };

  const sendSignupRequest = async (user, signInMethod) => {
    const userIdToken = await user.getIdToken();

    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + userIdToken,
      },
      body: JSON.stringify({
        user: { uid: user.uid, email: user.email },
        signInMethod: signInMethod,
      }),
    });

    const data = await response.json();

    return data;
  };

  const handleGmailSignup = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const { user } = result;
    const data = await sendSignupRequest(user, "gmail");

    // if there was an authentication or authorization error
    if (data.message) return;

    if (data.userAlreadyCreated) {
      console.log("user already created");
    } else {
      console.log("successfully created user");
      console.log(user.uid);
      console.log(user.email);
    }
    dispatch(signInUser(user));
  };

  const handleEmailPasswordSignup = async (email, password, formik) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      const data = await sendSignupRequest(user, "emailPassword");

      // if there was an authentication or authorization error
      if (data.message) return;

      // if there was an error with the form
      if (data.formErrors) {
        Object.entries(data.formErrors).forEach(({ fieldName, fieldError }) => {
          formik.setFieldError(fieldName, fieldError);
        });
        return;
      }

      console.log("successfully created user");
      console.log(user.uid);
      console.log(user.email);
      dispatch(signInUser(user));
    } catch (error) {
      if (error.message === FIREBASE_EMAIL_IN_USE) {
        formik.setFieldError("email", EMAIL_ALREADY_IN_USE);
      }
    }
  };

  const disableFormWrapper = (callback) => {
    return async (...args) => {
      setSignupButtonIsDisabled(true);
      await callback(...args);
      setSignupButtonIsDisabled(false);
    };
  };

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
          onSubmit={disableFormWrapper(onSubmit)}
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
                    mb={
                      !errorIsRendered("email", formik) &&
                      INPUT_FIELD_ERROR_MESSAGE_HEIGHT
                    }
                  >
                    <FormikControl
                      control="input"
                      label="Email"
                      name="email"
                      errorHeight={INPUT_FIELD_ERROR_MESSAGE_HEIGHT}
                    />
                  </Box>
                  {/* password input field */}
                  <Box
                    mb={
                      !errorIsRendered("password", formik) &&
                      INPUT_FIELD_ERROR_MESSAGE_HEIGHT
                    }
                  >
                    <FormikControl
                      control="input"
                      label="Password"
                      name="password"
                      type={!passwordIsVisible ? "password" : ""}
                      errorHeight={INPUT_FIELD_ERROR_MESSAGE_HEIGHT}
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
                      !errorIsRendered("password2", formik) &&
                      INPUT_FIELD_ERROR_MESSAGE_HEIGHT
                    }
                  >
                    <FormikControl
                      control="input"
                      label="Confirm Password"
                      name="password2"
                      type={!password2IsVisible ? "password" : ""}
                      errorHeight={INPUT_FIELD_ERROR_MESSAGE_HEIGHT}
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
