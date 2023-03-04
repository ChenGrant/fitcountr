import { Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import CustomDialog from "../../../components/ui/CustomDialog";
import { removeUserFood } from "../../../redux/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/system";
import CustomButton from "../../../components/ui/CustomButton";
import PostDataButton from "../../../components/ui/PostDataButton";
import { deleteFood } from "../../../utils/requestUtils";
import { CustomSnackbarDispatchContext } from "../../../components/layouts/snackbar/CustomSnackbarDispatchContext";
import { CUSTOM_SNACKBAR_ACTIONS } from "../../../components/layouts/snackbar/CustomSnackbar";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const DeleteFoodPopup = ({ isOpen, setIsOpen, food, backArrowOnClick }) => {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isDeletingFood, setIsDeletingFood] = useState(false);
  const customSnackbarDispatch = useContext(CustomSnackbarDispatchContext);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleClose = (functions = []) => {
    setIsOpen(false);
    functions.forEach((f) => f());
  };

  const handleDeleteFood = async (food) => {
    setIsDeletingFood(true);
    const response = await deleteFood(user, food.id);
    dispatch(removeUserFood(food.id));
    backArrowOnClick();
    customSnackbarDispatch({
      type: CUSTOM_SNACKBAR_ACTIONS.OPEN,
      payload: {
        severity: response.error ? "error" : "success",
        message: response.error
          ? `Could not delete ${food.name}`
          : `${food.name} deleted`,
      },
    });

    handleClose([() => setIsDeletingFood(false)]);
  };

  // ------------------------------------- RENDER -------------------------------------
  return (
    <CustomDialog open={isOpen} onClose={handleClose}>
      <Typography variant="h4" gutterBottom>
        Delete "{food.name}"?
      </Typography>
      <Box display="flex" gap={2} width="100%">
        {/* Back Button */}
        <Box flex={1}>
          <CustomButton
            variant="outlined"
            sx={{ textTransform: "none", width: "100%" }}
            onClick={handleClose}
          >
            Back
          </CustomButton>
        </Box>
        {/* Confirm Button */}
        <Box flex={1}>
          <PostDataButton
            isPostingData={isDeletingFood}
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => handleDeleteFood(food)}
          >
            Confirm
          </PostDataButton>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default DeleteFoodPopup;
