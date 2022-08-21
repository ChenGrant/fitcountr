import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import FormikControl from "../../../components/formik/FormikControl";
import { capitalizeOnlyFirstChar, PROGRESS_TYPE_NAMES } from "../../../utils";

const AddProgressPopupWeightFields = ({ UNIT_SELECT_OPTIONS }) => {
  const { progressType } = useSelector((state) => state.progressPage);

  return (
    <Box display="flex" flexDirection="column" gap={1} textAlign="left">
      <FormikControl
        control="input"
        type="number"
        label={capitalizeOnlyFirstChar(
          PROGRESS_TYPE_NAMES[progressType].singular
        )}
        name={progressType}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      />
      <FormikControl
        control="select"
        label="Unit"
        name="unit"
        options={UNIT_SELECT_OPTIONS}
        sx={{ textAlign: "left" }}
      />
    </Box>
  );
};

export default AddProgressPopupWeightFields;
