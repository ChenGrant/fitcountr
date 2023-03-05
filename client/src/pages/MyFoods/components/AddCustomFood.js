import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import BackArrow from "../../../components/layouts/backArrow/BackArrow";
import { MY_FOODS_PAGES } from "../utils";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const AddCustomFood = ({ setPage }) => {
  // ----------------------------------- FUNCTIONS -----------------------------------
  const backArrowOnClick = () => setPage({ name: MY_FOODS_PAGES.MY_FOODS });

  // ------------------------------------- RENDER -------------------------------------
  return (
    <BackArrow onClick={backArrowOnClick}>
      <Box>AddCustomFood</Box>
      <Typography>Make sure no name conflicts, barcode conflicts?</Typography>
    </BackArrow>
  );
};

export default AddCustomFood;
