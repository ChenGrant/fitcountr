import { Alert, Box, Snackbar, Typography } from "@mui/material";
import React from "react";

// ---------------------------- SNACKBAR REDUCER CONSTANTS ----------------------------
export const SNACKBAR_ACTIONS = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  CLOSE: "CLOSE",
};

export const INITIAL_SNACKBAR_STATE = {
  open: false,
  severity: "",
  message: "",
};

export const snackbarReducer = (state, action) => {
  switch (action.type) {
    case SNACKBAR_ACTIONS.CLOSE:
      return { ...INITIAL_SNACKBAR_STATE };
    case SNACKBAR_ACTIONS.SUCCESS:
      return {
        ...state,
        open: true,
        severity: "success",
        message: action.payload.message,
      };
    case SNACKBAR_ACTIONS.FAILURE:
      return {
        ...state,
        open: true,
        severity: "error",
        message: action.payload.message,
      };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
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
        severity={severity || "success"}
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
