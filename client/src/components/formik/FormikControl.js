import { Box } from "@mui/material";
import { FormikContext, useFormikContext } from "formik";
import React from "react";
import FormikInput from "./FormikInput";
import FormikSelect from "./FormikSelect";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FormikControl = ({ control, textErrorHeight = "24px", ...rest }) => {
  const formik = useFormikContext(FormikContext);
  const fieldProps = { ...rest, textErrorHeight };

  // ----------------------------------- FUNCTIONS -----------------------------------
  const errorIsRendered = (fieldName, formik) =>
    formik.errors[fieldName] && formik.touched[fieldName];

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box mb={!errorIsRendered(rest.name, formik) && textErrorHeight}>
      {(() => {
        switch (control) {
          case "input":
            return <FormikInput {...fieldProps} />;
          case "select":
            return <FormikSelect {...fieldProps} />;
          default:
            return null;
        }
      })()}
    </Box>
  );
};

export default FormikControl;
