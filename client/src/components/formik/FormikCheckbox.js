import { Checkbox, FormControlLabel } from "@mui/material";
import { Field } from "formik";
import React from "react";

const FormikCheckbox = ({ label, name }) => {
  return (
    <>
      <Field name={name}>
        {({ field }) => {
          return (
            <FormControlLabel
              sx={{ width: "100%" }}
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                />
              }
              label={label}
            />
          );
        }}
      </Field>
    </>
  );
};

export default FormikCheckbox;
