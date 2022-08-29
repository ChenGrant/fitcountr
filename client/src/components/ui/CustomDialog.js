import React from "react";
import { Box, Dialog, DialogContent } from "@mui/material";
const CustomDialog = ({ open, onClose, onExited, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{
        onExited,
      }}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogContent sx={{ "&::-webkit-scrollbar": { display: "none" } }}>
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
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
