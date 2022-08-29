import React from "react";
import FormikControl from "../../../../components/formik/FormikControl";

const CaloriesField = () => {
  return (
    <FormikControl
      control="input"
      type="number"
      label="Calories"
      name="calories"
      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
    />
  );
};

export default CaloriesField;
