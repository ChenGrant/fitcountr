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

// -------------------------------------- CONSTANTS --------------------------------------
const INPUT_FIELD_ERROR_MESSAGE_HEIGHT = "15px";

const BUTTON_STYLING = {
  borderRadius: "10px",
  textTransform: "none",
  color: "white",
};

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

const onSubmit = (values, formik) => {
  console.log(values);
};

// -------------------------------------- COMPONENT --------------------------------------
const LoginForm = ({ toggleForm }) => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const theme = useTheme();

  // given a the name attribute of an input field, fieldName, and the
  // formik object, errorIsRendered returns true if there is an error
  // being rendered for the input field with a name attribute of fieldName
  const errorIsRendered = (fieldName, formik) =>
    formik.errors[fieldName] && formik.touched[fieldName];

  const handleLoginWithGmail = () => {};

  const handleLoginWithEmailAndPassword = ({ email, password }) => {
    // send 'values' to server
    // on server end:
    // reapply validation schema. (if it fails to pass validation schema, render error messages)
    // check if there exists a user with that email/password
    // if no user with the entered email exists, errorMessage = 'email does not exist'
    // elseif no password, errorMessage = 'password is incorrect'
  };

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
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Typography variant="h1" gutterBottom textAlign="center">
                    Login
                  </Typography>
                  {/* "Login with Gmail" button */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={BUTTON_STYLING}
                    startIcon={
                      <GoogleIcon
                        sx={{ transform: "scale(1.5)", marginRight: "20px" }}
                      />
                    }
                  >
                    Login with Gmail
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
                  {/* guest login credentials */}
                  <Typography color="primary" textAlign="center">
                    Login as guest with email: <b>guest@guest.ca</b> and
                    password: <b>guest123</b>
                  </Typography>
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
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={BUTTON_STYLING}
                    >
                      Login
                    </Button>
                  </Box>
                  {/* Get started */}
                  <Box>
                    <Typography display="inline">
                      Don't have an account?{" "}
                    </Typography>
                    <Typography
                      display="inline"
                      color="primary"
                      sx={{ cursor: "pointer", fontWeight: 600 }}
                      onClick={toggleForm}
                    >
                      Signup
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

export default LoginForm;
