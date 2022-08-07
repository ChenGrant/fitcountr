import { Box } from "@mui/system";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import useScreenSize from "../../hooks/useScreenSize";

const BackArrow = ({ onClick }) => {
  const { desktop } = useScreenSize();

  return (
    <Box
      height={desktop ? "100px" : "60px"}
      display="flex"
      alignItems="center"
      mb={!desktop && 5}
      px={desktop ? 5 : "5px"}
    >
      <IconButton color="primary" onClick={onClick} size="large">
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

export default BackArrow;
