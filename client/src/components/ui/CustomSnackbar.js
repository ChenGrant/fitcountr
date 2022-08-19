import { Alert, Box, Snackbar, Typography } from "@mui/material";
import React from "react";

const CustomSnackbar = ({ open, severity, message, onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity={severity}
        sx={{
          display: severity ? "flex" : "none",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography>{message}</Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
