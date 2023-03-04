import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import {
  capitalizeFirstCharacter,
  round,
  sortByNutrient,
} from "../../../utils";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const MyFoodsItemPopup = ({ food, onClose }) => {
  const deleteFood = () => {
    console.log("delete this");
  };

  // ------------------------------------- RENDER -------------------------------------
  return (
    <CustomDialog open onClose={onClose}>
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
    </CustomDialog>
  );
};

export default MyFoodsItemPopup;
