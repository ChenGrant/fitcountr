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
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetchVerificationStatus } from "../../../utils";
import { setUser, setVerificationStatus } from "../../../redux";
import { useNavigate } from "react-router-dom";

// -------------------------------------- CONSTANTS --------------------------------------
const INPUT_FIELD_ERROR_MESSAGE_HEIGHT = "15px";

// given a the name attribute of an input field, fieldName, and the
// formik object, errorIsRendered returns true if there is an error
// being rendered for the input field with a name attribute of fieldName
const errorIsRendered = (fieldName, formik) =>
  formik.errors[fieldName] && formik.touched[fieldName];

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
  const { auth } = useSelector((state) => state.firebaseClient);
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordLoginButtonIsDisabled, setPasswordLoginButtonIsDisabled] =
    useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  // ----------------------------------- FUNCTIONS -----------------------------------

  const handleLoginWithGmail = async () => {
    // sign user in,
    // if user doesn't have a record, create one for them
    // setUser(user), setVerificationStatus('Verified')
    // navigate to dashboard
  };

  const handleLoginWithEmailAndPassword = async (email, password, formik) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
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
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          return formik.setFieldError("email", "Email not in use");
        case "auth/wrong-password":
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
                  <CustomButton
                    fullWidth
                    variant="contained"
                    onClick={handleLoginWithGmail}
                    startIcon={
                      <GoogleIcon
                        sx={{ transform: "scale(1.5)", marginRight: "20px" }}
                      />
                    }
                  >
                    Login with Gmail
                  </CustomButton>
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
            );
          }}
        </Formik>
      </Box>
    </Card>
  );
};

export default LoginForm;
