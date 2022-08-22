import React from "react";
import { useSelector } from "react-redux";
import { PROGRESS_TYPES } from "../../../../utils";
import StepsField from "./StepsField";
import WeightFields from "./WeightFields";

const ProgressTypeFields = () => {
  const { progressType } = useSelector((state) => state.progressPage);
  switch (progressType) {
    case PROGRESS_TYPES.WEIGHTS:
      return <WeightFields />;
    case PROGRESS_TYPES.STEPS:
      return <StepsField/>
    default:
      return null;
  }
};

export default ProgressTypeFields;
