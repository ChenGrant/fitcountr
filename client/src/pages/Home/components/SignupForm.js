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
import useScreenSize from "../../../hooks/useScreenSize";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/ui/CustomButton";
import { EMAIL_PASSWORD_PROVIDER, postSignupData } from "../../../utils";
import { useDispatch } from "react-redux";
import { setAuthenticatingUser } from "../../../redux";
import { handleAuthWithGmail } from "../utils";
import { ROUTE_PATHS } from "../../../setup/routes/routeUtils";

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

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SignupForm = ({
  toggleForm,
  setGmailOverridePopupState,
  setOverriddenGmailUser,
}) => {
  const theme = useTheme();
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { desktop, tablet } = useScreenSize();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [password2IsVisible, setPassword2IsVisible] = useState(false);
  const [passwordSignupButtonIsDisabled, setPasswordSignupButtonIsDisabled] =
    useState(false);
  const [gmailSignupButtonIsDisabled, setGmailSignupButtonIsDisabled] =
    useState(false);

  // ----------------------------------- FUNCTIONS -----------------------------------
  // handleEmailPasswordSignup uses the given email string, password string,
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
      const fetchedSignupData = await postSignupData(
        user,
        EMAIL_PASSWORD_PROVIDER
      );

      // if user was successfully created
      if (fetchedSignupData.userIsCreated)
        return navigate(`${ROUTE_PATHS.EMAIL_VERIFICATION}/${email}`);

      // if there was error creating user
      switch (fetchedSignupData.message) {
        case "Email already in use":
          return formik.setFieldError("email", "Email already in use");
        default:
          break;
      }
    } catch (err) {
      if (err.message === "Firebase: Error (auth/email-already-in-use).")
        return formik.setFieldError("email", "Email already in use");
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
            dispatch(setAuthenticatingUser(true));
            setPasswordSignupButtonIsDisabled(true);
            await handleEmailPasswordSignup(
              email.toLowerCase(),
              password,
              formik
            );
            setPasswordSignupButtonIsDisabled(false);
            dispatch(setAuthenticatingUser(false));
          }}
        >
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
                    onClick={async () => {
                      dispatch(setAuthenticatingUser(true));
                      await handleAuthWithGmail(
                        auth,
                        setOverriddenGmailUser,
                        setGmailOverridePopupState,
                        setGmailSignupButtonIsDisabled
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
              {/* confirm password input field */}
              <FormikControl
                control="input"
                label="Confirm Password"
                name="password2"
                type={!password2IsVisible ? "password" : ""}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setPassword2IsVisible(!password2IsVisible)}
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
            </Box>
          </Form>
        </Formik>
      </Box>
    </Card>
  );
};

export default SignupForm;
