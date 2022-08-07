import { Box } from "@mui/system";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeSearchFoodPage } from "../../redux";

const BackArrow = () => {
  const dispatch = useDispatch();

  return (
    <Box m={5}>
      <IconButton
        color="primary"
        onClick={() => dispatch(removeSearchFoodPage())}
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

export default BackArrow;
