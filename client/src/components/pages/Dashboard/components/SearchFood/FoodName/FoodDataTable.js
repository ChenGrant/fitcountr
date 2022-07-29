import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const FoodDataTable = ({ foodData }) => {
  return (
    <Box bgcolor = 'red'>
      {foodData.foods.map((food) => (
        <Typography>{food.description}</Typography>
      ))}
    </Box>
  );
};

export default FoodDataTable;
