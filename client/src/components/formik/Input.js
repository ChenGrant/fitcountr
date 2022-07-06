import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ErrorMessage, Field } from "formik";
import React, { useId } from "react";
import TextError from "./TextError";

const Input = ({ label, name, type, errorHeight, ...rest }) => {
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
                // BELOW IS POSSIBLE STYLING FOR THE LABEL AND BORDER
                // sx={{
                //   "& ": {
                //     //color: "green",
                //     //border: "2px solid green",
                //     // "&:hover": {
                //     //   //color: "blue",
                //     //   border: "2px solid red",
                //     // },
                //     "> fieldset": {
                //       borderColor: "red",
                //       //border: "3px solid green",
                //     },
                //   },
                //   "&:hover ": {
                //     "> fieldset": {
                //       border: "1px solid " + purple[500],
                //     },
                //   },
                // }}
              />
            </FormControl>
          );
        }}
      </Field>
      <ErrorMessage name={name}>
        {(errorMessage) => (
          <TextError errorHeight={errorHeight}>{errorMessage}</TextError>
        )}
      </ErrorMessage>
    </>
  );
};

export default Input;
