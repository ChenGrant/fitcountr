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
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" gutterBottom>
          Are you sure you want to logout?
        </Typography>
        <Box display="flex" gap={2} fullWidth justifyContent="center">
          <CustomButton
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: "10px", px: 3 }}
            onClick={() => setConfirmLogoutPopupIsOpen(false)}
          >
            No
          </CustomButton>
          <CustomButton
            variant="contained"
            sx={{ px: 3 }}
            onClick={() => signOut(auth)}
          >
            Yes
          </CustomButton>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ConfirmLogoutPopup;
