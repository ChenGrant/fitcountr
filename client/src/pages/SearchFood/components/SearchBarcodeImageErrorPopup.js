import { Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import ErrorIcon from "@mui/icons-material/Error";

const SearchBarcodeImageErrorPopup = ({
  barcodeErrorPopupIsOpen,
  setBarcodeErrorPopupIsOpen,
}) => {
  return (
    <CustomDialog
      open={barcodeErrorPopupIsOpen}
      onClose={() => setBarcodeErrorPopupIsOpen(false)}
    >
      <Typography variant="h4" gutterBottom>
        Scan Failed
      </Typography>
      <ErrorIcon color="primary" sx={{ fontSize: "100px" }} />
      <Typography>Could not detect barcode number from image</Typography>
      <CustomButton
        variant="contained"
        fullWidth
        onClick={() => setBarcodeErrorPopupIsOpen(false)}
      >
        Close
      </CustomButton>
    </CustomDialog>
  );
};

export default SearchBarcodeImageErrorPopup;
