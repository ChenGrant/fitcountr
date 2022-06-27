import {
  Button,
  Card,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import FormikControl from "../formik/FormikControl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

const onSubmit = (values, formik) => console.log(values);

const SignIn = () => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const errorHeight = "24px";

  const errorMessageIsRendered = (name, formik) =>
    formik.errors[name] && formik.touched[name];
  return (
    <Card sx={{ p: 3, borderRadius: "15px" }}>
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
                  <Typography variant="h1" gutterBottom>
                    Sign in
                  </Typography>
                  <Typography>refactor</Typography>
                  <Typography>ADD GOOGLE LOGIN </Typography>
                  <Typography>
                    fix textfield label font color on hover when there is text
                  </Typography>
                  <Typography>HANDLE FORGOT PASSWORD</Typography>
                  <Typography>
                    ADD ERROR HANDLING, make sure firebase response is not {}
                  </Typography>
                  <Typography>
                    WITH FOR LAPTOP AND PHONE IMAGES TO LOAD BEFORE RENDERING
                    (useReducer)
                  </Typography>
                  <Typography>
                    MAKE FONT FAMILY BETWEEN WEBSITE AND LOGO CONSISTENT
                  </Typography>
                  <Typography color="primary">
                    Use email: <b>guest@guest.ca</b> / password: <b>guest123</b>{" "}
                    to sign in as a guest
                  </Typography>
                  <Box
                    mb={!errorMessageIsRendered("email", formik) && errorHeight}
                  >
                    <FormikControl
                      control="input"
                      label="Email"
                      name="email"
                      errorHeight={errorHeight}
                    />
                  </Box>
                  <Box
                    mb={
                      !errorMessageIsRendered("password", formik) && errorHeight
                    }
                  >
                    <FormikControl
                      control="input"
                      label="Password"
                      name="password"
                      type={!passwordIsVisible ? "password" : ""}
                      errorHeight={errorHeight}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setPasswordIsVisible(!passwordIsVisible)
                            }
                          >
                            {passwordIsVisible ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Box>
                  <Box fullWidth>
                    <Typography
                      textAlign="right"
                      sx={{ cursor: "pointer", fontWeight: 600 }}
                      color="primary"
                    >
                      Forgot password?
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                      }}
                    >
                      Login
                    </Button>
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

export default SignIn;
