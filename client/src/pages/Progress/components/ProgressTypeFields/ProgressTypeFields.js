import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { PROGRESS_TYPES } from "../../../../utils";
import { PROGRESS_POPUP_TYPES } from "../Progress";
import CaloriesField from "./CaloriesField";
import FoodField from "./FoodField";
import StepsField from "./StepsField";
import WeightFields from "./WeightFields";

const ProgressTypeFields = ({ popupType }) => {
  const { progressType } = useSelector((state) => state.progressPage);

  if (
    popupType === PROGRESS_POPUP_TYPES.SET_GOAL &&
    progressType === PROGRESS_TYPES.CALORIES
  )
    return <CaloriesField />;

  return (
    <Box display="flex" flexDirection="column" gap={1} textAlign="left">
      {(() => {
        switch (progressType) {
          case PROGRESS_TYPES.WEIGHTS:
            return <WeightFields />;
          case PROGRESS_TYPES.STEPS:
            return <StepsField />;
          case PROGRESS_TYPES.CALORIES:
            return <FoodField />;
          default:
            return null;
        }
      })()}
    </Box>
  );
};

export default ProgressTypeFields;
