import { Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@emotion/react";

const SearchFoodNameErrorPopup = ({
  foodName,
  foodNameErrorPopupIsOpen,
  setFoodNameErrorPopupIsOpen,
}) => {
  const theme = useTheme();
  return (
    <CustomDialog
      open={foodNameErrorPopupIsOpen}
      onClose={() => setFoodNameErrorPopupIsOpen(false)}
    >
      <Typography variant="h4" gutterBottom>
        {foodName === "" ? "No Food Name Entered" : "No Nutritional Data Found"}
      </Typography>
      <ErrorIcon color="primary" sx={{ fontSize: "100px" }} />
      {foodName !== "" && (
        <Typography>
          Could not find nutritional data associated with a food name of{" "}
          <b style={{ color: theme.palette.primary.main }}>{foodName}</b>.
        </Typography>
      )}
      <CustomButton
        variant="contained"
        fullWidth
        onClick={() => setFoodNameErrorPopupIsOpen(false)}
      >
        Close
      </CustomButton>
    </CustomDialog>
  );
};

export default SearchFoodNameErrorPopup;
