import React from "react";
import { useSelector } from "react-redux";
import { capitalizeOnlyFirstChar, PROGRESS_TYPE_NAMES } from "../../../utils";
import FormikControl from "../../../components/formik/FormikControl";

const StepsField = () => {
  const { progressType } = useSelector((state) => state.progressPage);

  return (
    <FormikControl
      control="input"
      type="number"
      label={capitalizeOnlyFirstChar(
        PROGRESS_TYPE_NAMES[progressType].singular
      )}
      name={PROGRESS_TYPE_NAMES[progressType].singular}
      onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
    />
  );
};

export default StepsField;
