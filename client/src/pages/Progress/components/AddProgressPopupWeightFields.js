import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import FormikControl from "../../../components/formik/FormikControl";
import { capitalizeFirstCharacterLowercaseRest } from "../../../utils";

const AddProgressPopupWeightFields = ({ UNIT_SELECT_OPTIONS }) => {
  const { progressPage } = useSelector((state) => state);
  const stat = capitalizeFirstCharacterLowercaseRest(progressPage.stat);

  return (
    <Box display="flex" flexDirection="column" gap={1} textAlign="left">
      <FormikControl
        control="input"
        type="number"
        label={stat}
        name={progressPage.stat}
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
