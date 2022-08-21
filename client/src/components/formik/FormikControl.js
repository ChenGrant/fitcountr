import { Box } from "@mui/material";
import { FormikContext, useFormikContext } from "formik";
import React from "react";
import FormikCheckbox from "./FormikCheckbox";
import FormikInput from "./FormikInput";
import FormikSelect from "./FormikSelect";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FormikControl = ({ control, textErrorHeight = "24px", ...rest }) => {
  const formik = useFormikContext(FormikContext);
  const fieldProps = { ...rest, textErrorHeight };

  // ----------------------------------- FUNCTIONS -----------------------------------
  const errorIsNotRendered = (fieldName, formik) =>
    !formik.errors[fieldName] || !formik.touched[fieldName];

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box
      mb={
        control !== "checkbox" &&
        errorIsNotRendered(rest.name, formik) &&
        textErrorHeight
      }
    >
      {(() => {
        switch (control) {
          case "input":
            return <FormikInput {...fieldProps} />;
          case "select":
            return <FormikSelect {...fieldProps} />;
          case "checkbox":
            return <FormikCheckbox {...fieldProps} />;
          default:
            return null;
        }
      })()}
    </Box>
  );
};

export default FormikControl;
