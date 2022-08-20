import { Box, CircularProgress } from "@mui/material";
import React from "react";
import CustomButton from "./CustomButton";

const PostDataButton = ({ isPostingData, children, ...rest }) => {
  return (
    <Box height="56px" display="grid" sx={{ placeItems: "center" }}>
      {isPostingData ? (
        <CircularProgress />
      ) : (
        <CustomButton {...rest}>{children}</CustomButton>
      )}
    </Box>
  );
};

export default PostDataButton;
