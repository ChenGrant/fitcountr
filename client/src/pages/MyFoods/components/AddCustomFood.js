import { Box } from "@mui/system";
import React from "react";
import BackArrow from "../../../components/layouts/backArrow/BackArrow";

const AddCustomFood = ({ backArrowOnClick }) => {
  return (
    <BackArrow onClick={backArrowOnClick}>
      <Box>AddCustomFood</Box>
    </BackArrow>
  );
};

export default AddCustomFood;
