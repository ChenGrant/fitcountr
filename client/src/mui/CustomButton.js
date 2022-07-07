import { Button } from "@mui/material";
import React from "react";

const CustomButton = (props) => {
  if (props.variant !== "contained") return <Button {...props} />;

  const { sx, ...rest } = props;
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
