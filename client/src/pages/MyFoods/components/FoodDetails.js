import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import BackArrow from "../../../components/layouts/backArrow/BackArrow";
import CustomButton from "../../../components/ui/CustomButton";
import {
  capitalizeFirstCharacter,
  round,
  sortByNutrient,
} from "../../../utils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteFoodPopup from "./DeleteFoodPopup";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const FoodDetails = ({ backArrowOnClick, food }) => {
  const [deleteFoodPopupIsOpen, setDeleteFoodPopupIsOpen] = useState(false);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <BackArrow onClick={backArrowOnClick}>
      <Box
        display="flex"
        flexDirection="column"
        mt={3}
        gap={2}
        alignItems="center"
      >
        <Typography variant="h1" gutterBottom>
          <b>{food.name}</b>
        </Typography>
        <Typography gutterBottom>
          <b>
            Serving Size: {food.servingSize.value}
            {food.servingSize.unit}
          </b>
        </Typography>
        <Box minWidth="400px">
          {sortByNutrient(Object.entries(food.nutrients)).map(
            ([nutrientName, measurement], index) => {
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
          <Box display="flex" gap={2} mt={4}>
            <CustomButton
              variant="contained"
              startIcon={<EditIcon />}
              sx={{ flex: 1 }}
            >
              Edit
            </CustomButton>
            <CustomButton
              variant="contained"
              onClick={() => setDeleteFoodPopupIsOpen(true)}
              startIcon={<DeleteIcon />}
              sx={{ flex: 1 }}
            >
              Delete
            </CustomButton>
          </Box>
        </Box>
      </Box>
      <DeleteFoodPopup
        isOpen={deleteFoodPopupIsOpen}
        setIsOpen={setDeleteFoodPopupIsOpen}
        food={food}
        backArrowOnClick = {backArrowOnClick}
      />
    </BackArrow>
  );
};

export default FoodDetails;
