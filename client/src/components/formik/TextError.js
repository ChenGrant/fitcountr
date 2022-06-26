import { Typography } from "@mui/material";
import React from "react";

const TextError = ({ children }) => {
  return <Typography style={{ color: "red" }}>{children}</Typography>;
};

export default TextError;
