import { useTheme } from "@emotion/react";
import { Box, Typography, CircularProgress } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CustomButton from "../../../mui/CustomButton";
import CustomDialog from "../../../mui/CustomDialog";

const EmailVerificationPopup = ({
  email,
  sendingEmailPopup,
  setSendingEmailPopup,
  EMAIL_VERIFICATION_POPUP_STATES,
}) => {
  const { CLOSED, SENDING, SENT_SUCCESS, SENT_FAILED } =
    EMAIL_VERIFICATION_POPUP_STATES;
  const theme = useTheme();

  // ------------------------------------- RENDER -------------------------------------
  return (
    <CustomDialog
      open={sendingEmailPopup !== CLOSED}
      onClose={() => {
        sendingEmailPopup !== SENDING && setSendingEmailPopup(CLOSED);
      }}
    >
      {sendingEmailPopup === SENDING ? (
        <>
          {/* Verification Email Is Currently Resending */}
          <Typography variant="h4" gutterBottom>
            Sending Verification Email
          </Typography>
          <Box display="grid" sx={{ placeItems: "center" }} my={2}>
            <CircularProgress thickness={4} size={70} />
          </Box>
        </>
      ) : sendingEmailPopup === SENT_SUCCESS ? (
        <>
          {/* Verification Email Is Done Resending */}
          <Typography variant="h4" gutterBottom>
            Verification Email Sent
          </Typography>
          <Box display="grid" sx={{ placeItems: "center" }}>
            <CheckCircleIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: "100px",
              }}
            />
          </Box>
          <Typography gutterBottom>
            Sent to <b style={{ color: theme.palette.primary.main }}>{email}</b>
            .
          </Typography>
          <Typography mt={-3}>
            If the email is not in your inbox, check your spam.
          </Typography>
          <CustomButton
            variant="contained"
            fullWidth
            onClick={() => setSendingEmailPopup(CLOSED)}
          >
            Close
          </CustomButton>
        </>
      ) : sendingEmailPopup === SENT_FAILED ? (
        <>
          {/* Verification Email Failed To Send */}
          <Typography variant="h4" gutterBottom>
            Failed To Send Verification Email
          </Typography>
          <Box display="grid" sx={{ placeItems: "center" }}>
            <ErrorIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: "100px",
              }}
            />
          </Box>
          <Typography gutterBottom>
            Sorry, we were unable to send the verification email to{" "}
            <span style={{ color: theme.palette.primary.main }}>
              <b>{email}</b>
            </span>
            .
          </Typography>
          <CustomButton
            variant="contained"
            fullWidth
            onClick={() => setSendingEmailPopup(CLOSED)}
          >
            Close
          </CustomButton>
        </>
      ) : (
        <></>
      )}
    </CustomDialog>
  );
};

export default EmailVerificationPopup;
