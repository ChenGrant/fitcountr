import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { SEARCH_FOOD_PAGES } from "../../../utils";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import { useDispatch } from "react-redux";
import { addSearchFoodPage } from "../../../redux";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SearchBarcodeImageConfirmPopup = ({
  barcodeNumber,
  barcodeConfirmPopupIsOpen,
  setBarcodeConfirmPopupIsOpen,
}) => {
  const dispatch = useDispatch();

  const POPUP_OPTIONS = [
    {
      label: "Confirm",
      onClickHandler: () =>
        dispatch(
          addSearchFoodPage({
            name: SEARCH_FOOD_PAGES.FOOD_DATA,
            barcodeNumber,
          })
        ),
    },
    {
      label: "Edit Barcode Number",
      onClickHandler: () =>
        dispatch(
          addSearchFoodPage({
            name: SEARCH_FOOD_PAGES.SEARCH_BARCODE_NUMBER,
            barcodeNumber,
          })
        ),
    },
    {
      label: "Choose Another Image",
      onClickHandler: () => setBarcodeConfirmPopupIsOpen(false),
    },
  ];

  // ------------------------------------- RENDER -------------------------------------
  return (
    <CustomDialog
      open={barcodeConfirmPopupIsOpen}
      onClose={() => setBarcodeConfirmPopupIsOpen(false)}
    >
      <Typography variant="h4" gutterBottom>
        Barcode number is{" "}
        <Box component="span" color="primary.main">
          {barcodeNumber}
        </Box>
        ?
      </Typography>
      {POPUP_OPTIONS.map(({ label, onClickHandler }) => (
        <CustomButton
          key={label}
          variant="contained"
          sx={{ width: "100%" }}
          onClick={onClickHandler}
        >
          {label}
        </CustomButton>
      ))}
    </CustomDialog>
  );
};

export default SearchBarcodeImageConfirmPopup;
