import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import React, { useId } from "react";
import FormikTextError from "./FormikTextError";

const FormikSelect = ({ label, name, options, textErrorHeight }) => {
  const id = useId();

  return (
    <>
      <Field id={id} name={name}>
        {({ field }) => {
          return (
            <FormControl fullWidth>
              <InputLabel htmlFor={id}>{label}</InputLabel>
              <Select labelId={id} label={label} {...field}>
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
