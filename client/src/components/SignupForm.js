import {
  Box,
  Button,
  Card,
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
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { signInUser } from "../redux";

// -------------------------------------- CONSTANTS --------------------------------------
const INPUT_FIELD_ERROR_MESSAGE_HEIGHT = "15px";

const BUTTON_STYLING = {
  borderRadius: "10px",
  textTransform: "none",
  color: "white",
};

// -------------------------------------- FORMIK --------------------------------------
const initialValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Required")
    .email("Email must be a valid email address"),
  password: Yup.string()
    .required("Required")
    .min(8, "Password must be at 8 characters."),
  confirmPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

// -------------------------------------- COMPONENT --------------------------------------
const SignupForm = ({ toggleForm }) => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);

  const theme = useTheme();

  const auth = useSelector((state) => state.firebaseClient.auth);

  const dispatch = useDispatch();

  const { desktop, tablet } = useScreenSize();

  // -------------------------------------- FUNCTIONS --------------------------------------
  // given a the name attribute of an input field, fieldName, and the
  // formik object, errorIsRendered returns true if there is an error
  // being rendered for the input field with a name attribute of fieldName
  const errorIsRendered = (fieldName, formik) =>
    formik.errors[fieldName] && formik.touched[fieldName];

  const onSubmit = (values, formik) => {
    handleSignupWithEmailAndPassword(values);
    console.log(values);
  };

  const handleSignupWithEmailAndPassword = ({ email, password }) => {
    // send 'values' to server
    // on server end:
    // reapply validation schema. (if it fails to pass validation schema, render error messages)
    // check if there exists a user with that email/password
    // if no user with the entered email exists, errorMessage = 'email does not exist'
    // elseif no password, errorMessage = 'password is incorrect'
  };

  const handleSignupWithGmail = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userIdToken = await user.getIdToken();

    ////////////////////////
    // server side validation

    console.log(user);

    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + userIdToken,
      },
      body: JSON.stringify({ signup: { method: "Gmail" }, user: user }),
    });

    const data = await response.json();
    console.log(data);

    // send 'values' to server
    // on server end:
    // reapply validation schema. (if it fails to pass validation schema, render error messages)
    // check if there exists a user with that email/password
    // if no user with the entered email exists, errorMessage = 'email does not exist'
    // elseif no password, errorMessage = 'password is incorrect'
    dispatch(signInUser(user));
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
                    onClick={handleSignupWithGmail}
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
                      !errorIsRendered("confirmPassword", formik) &&
                      INPUT_FIELD_ERROR_MESSAGE_HEIGHT
                    }
                  >
                    <FormikControl
                      control="input"
                      label="Confirm Password"
                      name="confirmPassword"
                      type={!confirmPasswordIsVisible ? "password" : ""}
                      errorHeight={INPUT_FIELD_ERROR_MESSAGE_HEIGHT}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setConfirmPasswordIsVisible(
                                !confirmPasswordIsVisible
                              )
                            }
                          >
                            {confirmPasswordIsVisible ? (
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
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={BUTTON_STYLING}
                    >
                      Signup
                    </Button>
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
