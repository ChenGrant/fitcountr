import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import React, { useId } from "react";
import FormikTextError from "./FormikTextError";

const FormikInput = ({ label, name, type, textErrorHeight, ...rest }) => {
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
                inputProps={{
                  step: type === "number" ? "any" : undefined,
                }}
                {...rest}
                {...field}
              />
            </FormControl>
          );
        }}
      </Field>
      <ErrorMessage name={name}>
        {(errorMessage) => (
          <FormikTextError textErrorHeight={textErrorHeight}>
            {errorMessage}
          </FormikTextError>
        )}
      </ErrorMessage>
    </>
  );
};

export default FormikInput;
