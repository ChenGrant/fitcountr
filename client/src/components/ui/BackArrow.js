import { Box } from "@mui/system";
import React, { useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { RemovePageContext } from "../../pages/SearchFood/SearchFood";

const BackArrow = () => {
  const removePage = useContext(RemovePageContext);

  return (
    <Box m={5}>
      <IconButton color="primary" onClick={removePage}>
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

export default BackArrow;
