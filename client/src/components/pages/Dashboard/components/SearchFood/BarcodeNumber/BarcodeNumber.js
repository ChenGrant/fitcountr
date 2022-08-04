import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { AddPageContext, SetCurrentPageContext } from "../SearchFood";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../../../../ui/CustomButton";
import { PAGES } from "../../../../../../utils";
import useScreenSize from "../../../../../../hooks/useScreenSize";
import BackArrow from "../BackArrow";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const BarcodeNumber = ({ initialBarcodeNumber = "" }) => {
  const { desktop } = useScreenSize();
  const addPage = useContext(AddPageContext);
  const setCurrentPage = useContext(SetCurrentPageContext);
  const [barcodeNumber, setBarcodeNumber] = useState(initialBarcodeNumber);

  const handleSearchBarcodeNumber = (barcodeNumber) => {
    setCurrentPage({ name: PAGES.BARCODE_NUMBER, barcodeNumber });
    addPage({ name: PAGES.NUTRITIONAL_DATA, barcodeNumber });
  };

  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      <BackArrow />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={desktop ? 10 : 5}
        px={desktop ? 5 : 2}
        pb={5}
      >
        <Typography variant="h4" textAlign="center">
          Enter a Barcode Number
        </Typography>
        <Typography textAlign="center">
          Search up a product's nutritional data via its barcode number
        </Typography>
        <Box
          width="100%"
          maxWidth="500px"
          display="flex"
          flexDirection="column"
          gap={5}
        >
          <FormControl variant="outlined">
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
              startAdornment={<SearchIcon sx={{ color: "black", pr: 1 }} />}
            />
          </FormControl>
          <CustomButton
            variant="contained"
            onClick={() => handleSearchBarcodeNumber(barcodeNumber)}
          >
            Search
          </CustomButton>
        </Box>
      </Box>
    </>
  );
};

export default BarcodeNumber;
