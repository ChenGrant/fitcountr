import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const Loading = () => {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress color = 'secondary' />
    </Box>
  );
};

export default Loading;
