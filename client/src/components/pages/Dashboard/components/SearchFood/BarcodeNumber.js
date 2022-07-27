import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { PopPageContext } from "./SearchFood";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const BarcodeNumber = ({ initialBarcodeNumber = "" }) => {
  const popPage = useContext(PopPageContext);
  const [barcodeNumber, setBarcodeNumber] = useState(initialBarcodeNumber);

  const handleSearchBarcodeNumber = (barcodeNumber) => {
    console.log(barcodeNumber);
  };

  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      <Box m={5}>
        <IconButton color="primary" onClick={() => popPage()}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={10}
      >
        <Typography variant="h4">Enter a Barcode Number</Typography>
        <Typography>
          Search up a product's nutritional data via its barcode number
        </Typography>
        <FormControl
          variant="outlined"
          sx={{ width: "90%", maxWidth: "500px", mt: -7 }}
        >
          <InputLabel>Barcode Number</InputLabel>
          <OutlinedInput
            label={"Barcode Number"}
            type="input"
            value={barcodeNumber}
            onChange={(e) => setBarcodeNumber(e.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              handleSearchBarcodeNumber(barcodeNumber);
            }}
            variant="outlined"
            placeholder="Ex: 064900407482"
            endAdornment={
              <IconButton
                onClick={() => handleSearchBarcodeNumber(barcodeNumber)}
              >
                <SearchIcon sx={{ color: "black" }} />
              </IconButton>
            }
          />
        </FormControl>
      </Box>
    </>
  );
};

export default BarcodeNumber;
