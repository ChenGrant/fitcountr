import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import { PAGES } from "../../../../../../utils";
import CustomButton from "../../../../../ui/CustomButton";
import CustomDialog from "../../../../../ui/CustomDialog";
import { PushPageContext } from "../SearchFood";

const BarcodeConfirmPopup = ({
  barcodeNumber,
  barcodeConfirmPopupIsOpen,
  setBarcodeConfirmPopupIsOpen,
}) => {
  const pushPage = useContext(PushPageContext);

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
      <CustomButton
        variant="contained"
        sx={{ width: "100%" }}
        onClick={() =>
          pushPage({ name: PAGES.NUTRITIONAL_DATA, barcodeNumber })
        }
      >
        Confirm
      </CustomButton>
      <CustomButton
        variant="contained"
        sx={{ width: "100%" }}
        onClick={() =>
          pushPage({
            name: PAGES.BARCODE_NUMBER,
            barcodeNumber,
          })
        }
      >
        Edit Barcode Number
      </CustomButton>
      <CustomButton
        variant="contained"
        sx={{ width: "100%" }}
        onClick={() => setBarcodeConfirmPopupIsOpen(false)}
      >
        Choose Another Image
      </CustomButton>
    </CustomDialog>
  );
};

export default BarcodeConfirmPopup;
