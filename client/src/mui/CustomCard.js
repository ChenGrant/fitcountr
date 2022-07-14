import { Card } from "@mui/material";
import React from "react";

const CustomCard = ({ sx, ...rest }) => {
  return (
    <Card
      sx={{
        py: 3,
        px: 5,
        boxShadow: 4,
        borderRadius: "10px",
        ...sx,
      }}
      {...rest}
    />
  );
};

export default CustomCard;
