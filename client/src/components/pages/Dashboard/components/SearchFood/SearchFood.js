import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import CustomButton from "../../../../ui/CustomButton";

const GAP_SIZE = 4;

const SearchFood = () => {
  const [file, setFile] = useState();

  const uploadHandler = async (event) => {
    const data = new FormData();
    data.append("file", event.target.files[0]);
    const response = await fetch("/searchFood/barcode", {
      method: "POST",
      body: data,
    });
    const responseData = await response.json();
    console.log(responseData);
  };

  return (
    <Box p={4} display="flex" flexDirection="column" gap={GAP_SIZE}>
      <Typography>Upload Image of a Food's Barcode</Typography>
      <TextField type="file" onChange={uploadHandler} />
      {/* <CustomButton variant="contained" onClick={handleSubmit}>
        Submit Barcode
      </CustomButton> */}
    </Box>
  );
};

export default SearchFood;
