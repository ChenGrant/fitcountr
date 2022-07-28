import { Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../../../../ui/CustomButton";
import CustomDialog from "../../../../../ui/CustomDialog";
import ErrorIcon from "@mui/icons-material/Error";
import { useTheme } from "@emotion/react";

const BarcodeNumberErrorPopup = ({
  barcodeNumber,
  barcodeNumberErrorPopupIsOpen,
  setBarcodeNumberErrorPopupIsOpen,
}) => {
  const theme = useTheme();
  return (
    <CustomDialog
      open={barcodeNumberErrorPopupIsOpen}
      onClose={() => setBarcodeNumberErrorPopupIsOpen(false)}
    >
      <Typography variant="h4" gutterBottom>
        No Nutritional Data Found
      </Typography>
      <ErrorIcon color="primary" sx={{ fontSize: "100px" }} />
      <Typography>
        Could not find nutritional data associated with the barcode number{" "}
        <b style={{ color: theme.palette.primary.main }}>{barcodeNumber}</b>.
      </Typography>
      <CustomButton
        variant="contained"
        fullWidth
        onClick={() => setBarcodeNumberErrorPopupIsOpen(false)}
      >
        Close
      </CustomButton>
    </CustomDialog>
  );
};

export default BarcodeNumberErrorPopup;
