import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const FormikTextError = ({ textErrorHeight, children }) => {
  return (
    <Box height={textErrorHeight}>
      <Typography sx={{ color: "red" }}>{children}</Typography>
    </Box>
  );
};

export default FormikTextError;
