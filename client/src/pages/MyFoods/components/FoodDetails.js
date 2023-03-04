import { Box, Typography } from "@mui/material";
import React from "react";
import BackArrow from "../../../components/layouts/backArrow/BackArrow";
import CustomButton from "../../../components/ui/CustomButton";
import {
  capitalizeFirstCharacter,
  round,
  sortByNutrient,
} from "../../../utils";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FoodDetails = ({ backArrowOnClick, food }) => {
  
  // ----------------------------------- FUNCTIONS -----------------------------------
  const deleteFood = () => console.log(food);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <BackArrow onClick={backArrowOnClick}>
      <Box>FoodDetails</Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" gutterBottom>
          <b>{food.name}</b>
        </Typography>
        <Typography gutterBottom>
          <b>
            Serving Size: {food.servingSize.value}
            {food.servingSize.unit}
          </b>
        </Typography>
        <Box>
          {sortByNutrient(Object.entries(food.nutrients)).map(
            ([nutrientName, measurement]) => {
              const { value, unit } = measurement;
              return (
                <Box
                  key={nutrientName}
                  display="flex"
                  borderTop="1px solid #D3D3D3"
                  py={1}
                >
                  <Box flex={1}>
                    <Typography textAlign="left">
                      {capitalizeFirstCharacter(nutrientName)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography textAlign="right">
                      {`${round(value, 2)} ${unit ?? ""}`}
                    </Typography>
                  </Box>
                </Box>
              );
            }
          )}
        </Box>
        <CustomButton variant="contained">Edit</CustomButton>
        <CustomButton variant="contained" onClick={deleteFood}>
          Delete
        </CustomButton>
      </Box>
    </BackArrow>
  );
};

export default FoodDetails;
