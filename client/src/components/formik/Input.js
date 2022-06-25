import { TextField } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import React from "react";
import TextError from "./TextError";

const Input = (props) => {
  const { label, name, type, ...rest } = props;
  return (
    <>
      <Field name={name} {...rest}>
        {({ field }) => {
          return (
            <TextField
              label={label}
              type={type}
              variant="outlined"
              autoComplete={type}
              {...field}
            />
          );
        }}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </>
  );
};

export default Input;
