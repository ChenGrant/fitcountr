import { Box } from "@mui/system";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { removeSearchFoodPage } from "../../redux";
import useScreenSize from "../../hooks/useScreenSize";

const BackArrow = () => {
  const dispatch = useDispatch();
  const { desktop } = useScreenSize();

  return (
    <Box
      height={desktop ? "100px" : "60px"}
      display="flex"
      alignItems="center"
      mb={!desktop && 5}
      px={desktop ? 5 : "5px"}
    >
      <IconButton
        color="primary"
        onClick={() => dispatch(removeSearchFoodPage())}
        size="large"
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
};

export default BackArrow;
