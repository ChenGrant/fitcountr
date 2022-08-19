import { Box } from "@mui/material";
import React from "react";
import FormikControl from "../../../components/formik/FormikControl";
import {
  capitalizeFirstCharacterLowercaseRest,
  SEXES,
  sortArray,
} from "../../../utils";

// ------------------------------------ CONSTANTS ------------------------------------
const SEX_SELECT_OPTIONS = sortArray(SEXES, (sex1, sex2) =>
  sex1.localeCompare(sex2)
).map((sex) => ({
  label: capitalizeFirstCharacterLowercaseRest(sex),
  value: sex,
}));

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const ProfileInputFields = () => {
  return (
    <>
      {/* Sex */}
      <Box flex={1}>
        <FormikControl
          control="select"
          label="Sex"
          name="sex"
          options={SEX_SELECT_OPTIONS}
        />
      </Box>
      {/* Height */}
      <Box flex={1}>
        <FormikControl
          control="input"
          type="number"
          label="Height (cm)"
          name="height"
          step="0.5"
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
      </Box>
      {/* Birthday */}
      <Box flex={1}>
        <FormikControl
          control="input"
          label={"Birthday (DD/MM/YYYY)"}
          name="birthday"
        />
      </Box>
    </>
  );
};

export default ProfileInputFields;
