import { Box, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../../../ui/CustomButton";
import CustomDialog from "../../../../ui/CustomDialog";
import { getAuth, signOut } from "firebase/auth";

const ConfirmLogoutPopup = ({
  confirmLogoutPopupIsOpen,
  setConfirmLogoutPopupIsOpen,
}) => {
  const auth = getAuth();
  return (
    <CustomDialog
      open={confirmLogoutPopupIsOpen}
      onClose={() => setConfirmLogoutPopupIsOpen(false)}
    >
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography variant="h4" gutterBottom>
          Logout?
        </Typography>
        <Box display="flex" gap={2}>
          <CustomButton variant="contained" onClick={() => signOut(auth)}>
            Yes, logout
          </CustomButton>
          <CustomButton
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: "10px" }}
            onClick={() => setConfirmLogoutPopupIsOpen(false)}
          >
            Cancel
          </CustomButton>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ConfirmLogoutPopup;
