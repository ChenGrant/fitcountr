import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const LoadingCircle = () => {
  return (
    <Box
      width="100%"
      height="100vh"
      display="grid"
      sx={{ placeItems: "center" }}
    >
      <CircularProgress color="primary" thickness={4} size={100} />
    </Box>
  );
};

export default LoadingCircle;
