import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";

const Progress = () => {
  const { progressPage } = useSelector((state) => state);
  return (
    <Box>
      <Typography>Progress</Typography>
      <Typography>{progressPage.stat}</Typography>
    </Box>
  );
};

export default Progress;
