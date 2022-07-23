import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  fetchBarcode,
  fetchNutritionFromBarcode,
} from "../../../../../utils/fetchRequestUtils";
import CustomButton from "../../../../ui/CustomButton";
import LoadingCircle from "../../../../ui/LoadingCircle";

const GAP_SIZE = 4;

const SearchFood = () => {
  const [files, setFiles] = useState();
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleSubmit = async () => {
    if (files === undefined || files.length === 0) return;
    setScanning(true);
    //const fetchedBarcode = await fetchBarcode(files[0]);
    const fetchedBarcode = {
      BarcodeType: "UPC_A",
      RawText: "605388716637",
      Successful: true,
    };
    setBarcode(fetchedBarcode.RawText);
    console.log(fetchedBarcode);
    const fetchedNutrition = fetchedBarcode.RawText
      ? await fetchNutritionFromBarcode(fetchedBarcode.RawText)
      : "none";
    console.log(fetchedNutrition);
    setScanning(false);
  };

  return (
    <Box p={4} display="flex" flexDirection="column" gap={GAP_SIZE}>
      {scanning ? (
        <LoadingCircle />
      ) : (
        <>
          <Typography>Upload Image of a Food's Barcode</Typography>
          <TextField type="file" onChange={(e) => setFiles(e.target.files)} />
          <CustomButton variant="contained" onClick={handleSubmit}>
            Submit Barcode
          </CustomButton>
        </>
      )}
      {barcode && <Typography>Barcode: {barcode}</Typography>}
    </Box>
  );
};

export default SearchFood;
