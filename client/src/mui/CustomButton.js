import { Button } from "@mui/material";
import React from "react";

const CustomButton = ({ sx, ...rest }) => {
  return (
    <Button
      sx={{
        borderRadius: "10px",
        textTransform: "none",
        color: "white",
        ...sx,
      }}
      {...rest}
    />
  );
};

export default CustomButton;
