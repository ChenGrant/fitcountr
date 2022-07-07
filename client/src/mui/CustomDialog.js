import React from "react";
import { Box, Dialog } from "@mui/material";
const CustomDialog = ({ open, onClose, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <Box
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={3}
        textAlign="center"
        borderRadius="300px"
      >
        {children}
      </Box>
    </Dialog>
  );
};

export default CustomDialog;
