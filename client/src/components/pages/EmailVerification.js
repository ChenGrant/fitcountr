import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PinInput from "react-pin-input";
import { CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import useScreenSize from "../../hooks/useScreenSize";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const EmailVerification = () => {
  const { email } = useParams();
  const { phone } = useScreenSize();
  const theme = useTheme();

  const [verifyingCode, setVerifyingCode] = useState(false);
  const [incorrectCode, setIncorrectCode] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState(false);

  const verifyEmail = async (email, code) => {
    const response = await fetch("/signup/emailverification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      // if current user's email matches this page's email, sign in,
      // otherwise redirect to sign in page
      console.log("email is verified");
      setIncorrectCode(false);
      setVerifiedCode(true);
    } else {
      setIncorrectCode(true);
      console.log("failed to verify");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      fullWidth
      height="90vh"
    >
      {verifiedCode ? (
        <Box display="flex" alignItems="center" gap={2}>
          <CheckCircleOutlineIcon sx={{ fontSize: "60px" }} />
          <Typography variant="h1">Code successfully verified.</Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h4" textAlign="center" mb={2}>
            A verification email has been sent to
            <span style={{ color: theme.palette.primary.main }}> {email}</span>.
          </Typography>
          <Typography variant="h6" mb={8}>
            Enter the code found within the email. Check your spam.
          </Typography>
          <Box height="100px" alignItems="center" justifyContent="center">
            {verifyingCode ? (
              <Box>
                <CircularProgress />
              </Box>
            ) : (
              <PinInput
                length={5}
                initialValue=""
                type="numeric"
                inputMode="number"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: true,
                  gap: phone ? "5px" : "10px",
                }}
                inputStyle={{
                  border: `3px solid ${theme.palette.primary.main}`,
                  borderRadius: "10px",
                  height: phone ? "40px" : "70px",
                  width: phone ? "40px" : "70px",
                  fontSize: phone ? "20px" : "30px",
                  fontFamily: theme.typography.fontFamily,
                }}
                onComplete={async (value) => {
                  setVerifyingCode(true);
                  await verifyEmail(email, parseInt(value));
                  setVerifyingCode(false);
                }}
                autoSelect={true}
                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              />
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            visibility={incorrectCode ? "visibile" : "hidden"}
          >
            <ErrorOutlineIcon sx={{ color: "red" }} />
            <Typography
              variant="h6"
              sx={{
                color: "red",
              }}
            >
              Incorrect code.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default EmailVerification;
