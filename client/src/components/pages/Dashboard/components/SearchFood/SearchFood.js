import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { fetchBarcode } from "../../../../../utils/fetchRequestUtils";
import CustomButton from "../../../../ui/CustomButton";

const GAP_SIZE = 4;

const SearchFood = () => {
  const [files, setFiles] = useState();

  const handleSubmit = async () => {
    if (files === undefined || files.length === 0) return;
    console.log(files[0])
    const fetchedBarcode = await fetchBarcode(files[0]);
    console.log(fetchedBarcode);
  };

  return (
    <Box p={4} display="flex" flexDirection="column" gap={GAP_SIZE}>
      <Typography>Upload Image of a Food's Barcode</Typography>
      <TextField type="file" onChange={(e) => setFiles(e.target.files)} />
      <CustomButton variant="contained" onClick={handleSubmit}>
        Submit Barcode
      </CustomButton>
    </Box>
  );
};

export default SearchFood;
