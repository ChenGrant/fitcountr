import { Box } from "@mui/material";
import React from "react";
import BackArrow from "../../../components/layouts/backArrow/BackArrow";
import { MY_FOODS_PAGES } from "../utils";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const EditFood = ({ food, setPage }) => {
  console.log(food)

  // ----------------------------------- FUNCTIONS -----------------------------------
  const backArrowOnClick = () => setPage(MY_FOODS_PAGES.MY_FOODS);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <BackArrow onClick={backArrowOnClick}>
      <Box>EditFood</Box>
    </BackArrow>
  );
};

export default EditFood;
