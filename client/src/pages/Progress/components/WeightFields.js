import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import FormikControl from "../../../components/formik/FormikControl";
import {
  capitalizeOnlyFirstChar,
  PROGRESS_TYPE_NAMES,
  sortArray,
  WEIGHT_UNITS,
} from "../../../utils";

// -------------------------------- CONSTANTS --------------------------------
export const UNIT_SELECT_OPTIONS = sortArray(
  WEIGHT_UNITS.map((unit) => ({
    label: `${unit.pluralName} (${unit.symbol})`,
    value: unit.symbol,
  })),
  (option1, option2) => option1.label.localeCompare(option2.label)
);

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const WeightFields = () => {
  const { progressType } = useSelector((state) => state.progressPage);

  return (
    <Box display="flex" flexDirection="column" gap={1} textAlign="left">
      <FormikControl
        control="input"
        type="number"
        label={capitalizeOnlyFirstChar(
          PROGRESS_TYPE_NAMES[progressType].singular
        )}
        name={PROGRESS_TYPE_NAMES[progressType].singular}
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

export default WeightFields;
