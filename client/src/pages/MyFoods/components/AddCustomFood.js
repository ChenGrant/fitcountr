import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import BackArrow from "../../../components/layouts/backArrow/BackArrow";

const AddCustomFood = ({ backArrowOnClick }) => {
  return (
    <BackArrow onClick={backArrowOnClick}>
      <Box>AddCustomFood</Box>
      <Typography>Make sure no name conflicts, barcode conflicts?</Typography>
    </BackArrow>
  );
};

export default AddCustomFood;
