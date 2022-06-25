import { Button, IconButton, Typography } from "@mui/material";
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
  email: Yup.string().required("Required").email("Invalid Email"),
  password: Yup.string().required("Required"),
});

const onSubmit = (values, formik) => console.log(values);

const SignIn = () => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <Box>
            <Typography>Sign in to fitcoutnr</Typography>
            <Box>
              <FormikControl control="input" label="email" name="email" />
            </Box>
            <Box>
              <FormikControl
                control="input"
                label="password"
                name="password"
                type={!passwordIsVisible && "password"}
              />
              <IconButton
                onClick={() => setPasswordIsVisible(!passwordIsVisible)}
              >
                {passwordIsVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Box>
            <Box>
              <Typography>Forgot password?</Typography>
            </Box>
            <Box>
              <Button type="submit" variant = 'contained'>Login</Button>
            </Box>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
};

export default SignIn;
