import { Alert, Box, Snackbar, Typography } from "@mui/material";
import React, { useReducer } from "react";
import { CustomSnackbarDispatchProvider } from "./CustomSnackbarDispatchContext";

// ---------------------------- SNACKBAR REDUCER CONSTANTS ----------------------------
export const SNACKBAR_ACTIONS = {
  OPEN: "OPEN",
  CLOSE: "CLOSE",
};

const INITIAL_SNACKBAR_STATE = {
  open: false,
  severity: "",
  message: "",
};

const snackbarReducer = (state, action) => {
  switch (action.type) {
    case SNACKBAR_ACTIONS.CLOSE:
      return { ...INITIAL_SNACKBAR_STATE };
    case SNACKBAR_ACTIONS.OPEN:
      return { ...state, open: true, ...action.payload };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const CustomSnackbar = ({ children }) => {
  const [snackbar, snackbarDispatch] = useReducer(
    snackbarReducer,
    INITIAL_SNACKBAR_STATE
  );
  return (
    <>
      <CustomSnackbarDispatchProvider value={snackbarDispatch}>
        {children}
      </CustomSnackbarDispatchProvider>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => snackbarDispatch({ type: SNACKBAR_ACTIONS.CLOSE })}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity || "success"}
          sx={{
            display: snackbar.severity ? "flex" : "none",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography>{snackbar.message}</Typography>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomSnackbar;
