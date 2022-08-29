import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { PROGRESS_TYPES } from "../../../../utils";
import MealField from "./MealField";
import StepsField from "./StepsField";
import WeightFields from "./WeightFields";

const ProgressTypeFields = () => {
  const { progressType } = useSelector((state) => state.progressPage);
  return (
    <Box display="flex" flexDirection="column" gap={1} textAlign="left">
      {(() => {
        switch (progressType) {
          case PROGRESS_TYPES.WEIGHTS:
            return <WeightFields />;
          case PROGRESS_TYPES.STEPS:
            return <StepsField />;
          case PROGRESS_TYPES.CALORIES:
            return <MealField />;
          default:
            return null;
        }
      })()}
    </Box>
  );
};

export default ProgressTypeFields;
