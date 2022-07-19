import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import useScreenSize from "../../../../../hooks/useScreenSize";

const NavigationBarItem = ({ isOpen, name, displayComponent, ...rest }) => {
  const { desktop } = useScreenSize();

  return (
    <Box
      minHeight={desktop ? "75px" : "60px"}
      display="flex"
      alignItems="center"
      px={(!desktop || isOpen) && 2}
      borderRadius="10px"
      gap={2}
      sx={{
        cursor: "pointer",
        "&:hover": {
          bgcolor: "rgba(145, 158, 171, 0.12)",
        },
      }}
      {...rest}
    >
      {displayComponent}
      {(!desktop || isOpen) && <Typography>{name}</Typography>}
    </Box>
  );
};

export default NavigationBarItem;
