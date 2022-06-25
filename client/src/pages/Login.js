import React from "react";
import { Box, Typography } from "@mui/material";

const Login = () => {
  return (
    <Box display="flex" height="100vh">
      <Box width="500px">Yes</Box>
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="red"
        fullWidth
      >
        <Box width="200px" bgcolor="white">
          <Typography>Sign In</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
