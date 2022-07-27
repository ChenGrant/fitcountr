import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CustomButton from "../../../../ui/CustomButton";
import CustomDialog from "../../../../ui/CustomDialog";

const BarcodeConfirmPopup = ({
  barcodeNumber,
  barcodeConfirmPopupIsOpen,
  setBarcodeConfirmPopupIsOpen,
}) => {
  return (
    <CustomDialog
      open={barcodeConfirmPopupIsOpen}
      onClose={() => setBarcodeConfirmPopupIsOpen(false)}
    >
      <Typography variant="h4" gutterBottom>
        Scanned barcode number{" "}
        <Box component="span" color="primary.main">
          {barcodeNumber}
        </Box>
        ?
      </Typography>
      <CustomButton variant="contained" sx={{ width: "100%" }}>
        Confirm
      </CustomButton>
      <CustomButton variant="contained" sx={{ width: "100%" }}>
        Edit Barcode Number
      </CustomButton>
      <CustomButton
        variant="contained"
        sx={{ width: "100%" }}
        onClick={() => setBarcodeConfirmPopupIsOpen(false)}
      >
        Close
      </CustomButton>
    </CustomDialog>
  );
};

export default BarcodeConfirmPopup;
