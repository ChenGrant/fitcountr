import { Box } from "@mui/material";
import React, { useContext } from "react";
import BackArrow from "../../../components/layouts/backArrow/BackArrow";
import { MyFoodsPageDispatchContext } from "../context/MyFoodsPageDispatchContext";
import { MY_FOODS_PAGES } from "../utils";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const EditFood = ({ food }) => {
  const MyFoodsPageDispatch = useContext(MyFoodsPageDispatchContext);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const backArrowOnClick = () =>
    MyFoodsPageDispatch({ name: MY_FOODS_PAGES.FOOD_DETAILS, food });

  // ------------------------------------- RENDER -------------------------------------
  return (
    <BackArrow onClick={backArrowOnClick}>
      <Box>EditFood</Box>
    </BackArrow>
  );
};

export default EditFood;
