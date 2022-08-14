import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const FormikTextError = ({ errorHeight, children }) => {
  return (
    <Box height={errorHeight}>
      <Typography sx={{ color: "red" }}>{children}</Typography>
    </Box>
  );
};

export default FormikTextError;
