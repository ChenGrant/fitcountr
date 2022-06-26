import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import React, { useId } from "react";
import TextError from "./TextError";

const Input = (props) => {
  const { label, name, type, ...rest } = props;
  const id = useId();
  return (
    <>
      <Field name={name}>
        {({ field }) => {
          return (
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor={id}>{label}</InputLabel>
              <OutlinedInput
                id={id}
                label={label}
                type={type}
                variant="outlined"
                autoComplete={type}
                {...rest}
                {...field}
              />
            </FormControl>
          );
        }}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </>
  );
};

export default Input;
