import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import { SEARCH_FOOD_PAGES } from "../../../utils";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import { AddPageContext } from "../SearchFood";
import { v4 as uuidv4 } from "uuid";

const BarcodeConfirmPopup = ({
  barcodeNumber,
  barcodeConfirmPopupIsOpen,
  setBarcodeConfirmPopupIsOpen,
}) => {
  const addPage = useContext(AddPageContext);

  const POPUP_OPTIONS = [
    {
      label: "Confirm",
      onClickHandler: () =>
        addPage({ name: SEARCH_FOOD_PAGES.NUTRITIONAL_DATA, barcodeNumber }),
    },
    {
      label: "Edit Barcode Number",
      onClickHandler: () =>
        addPage({
          name: SEARCH_FOOD_PAGES.BARCODE_NUMBER,
          barcodeNumber,
        }),
    },
    {
      label: "Choose Another Image",
      onClickHandler: () => setBarcodeConfirmPopupIsOpen(false),
    },
  ];

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
          key={uuidv4()}
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

export default BarcodeConfirmPopup;
