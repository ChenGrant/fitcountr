import React from "react";
import FormikInput from "./FormikInput";
import FormikSelect from "./FormikSelect";

const FormikControl = ({ control, ...rest }) => {
  switch (control) {
    case "input":
      return <FormikInput {...rest} />;
    case "select":
      return <FormikSelect {...rest} />;
    default:
      return null;
  }
};

export default FormikControl;
