import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";

// ------------------------------------ CONSTANTS ------------------------------------
export const GMAIL_OVERRIDE_POPUP_STATES = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
  PENDING: "PENDING",
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const GmailOverridePopup = ({
  gmailOverridePopupState,
  setGmailOverridePopupState,
  overriddenGmailUser,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  if (overriddenGmailUser === undefined) return null;

  return (
    <CustomDialog
      open={gmailOverridePopupState === GMAIL_OVERRIDE_POPUP_STATES.OPEN}
    >
      <Typography variant="h4" gutterBottom>
        Login Method Overridden To Gmail
      </Typography>
      <Typography>
        The email
        <b style={{ color: theme.palette.primary.main }}>
          {" "}
          {overriddenGmailUser.email}{" "}
        </b>
        is used by an existing account. This account's login method has been
        overridden to now use Gmail.
      </Typography>
      <Typography>
        <b>For future logins, use Gmail.</b>
      </Typography>
      <CustomButton
        variant="contained"
        onClick={() => {
          setGmailOverridePopupState(GMAIL_OVERRIDE_POPUP_STATES.CLOSED);
          navigate("/dashboard");
        }}
      >
        I understand
      </CustomButton>
    </CustomDialog>
  );
};

export default GmailOverridePopup;
