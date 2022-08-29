import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import React, { useId } from "react";
import FormikTextError from "./FormikTextError";

const FormikSelect = ({ label, name, options, textErrorHeight, ...rest }) => {
  const id = useId();

  return (
    <>
      <Field name={name}>
        {({ field }) => {
          return (
            <FormControl fullWidth {...rest}>
              <InputLabel htmlFor={id}>{label}</InputLabel>
              <Select
                labelId={id}
                label={label}
                sx={{ textAlign: "left" }}
                {...field}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
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

export default FormikSelect;
