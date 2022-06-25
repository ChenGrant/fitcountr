import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Loading from "./Loading";

const Home = () => {
  const [loadingLogo, setLoadingLogo] = useState(true);
  return (
    <>
      {loadingLogo && <Loading />}
      <Box display={loadingLogo ? "none" : "flex"} height="100vh">
        <Box width="800px">
          <img
            style={{ height: "100px" }}
            alt="logo"
            onLoad={() => setLoadingLogo(false)}
            src="https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Flogo%2Flogo.svg?alt=media&token=e67a9e25-c187-4c85-a9f1-5d3d88e9cd90"
          />
          <Typography variant="h4">
            Track your fitness journey today with fitcountr
          </Typography>
        </Box>
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fullWidth
        >
          <Box width="200px" bgcolor="white">
            <Typography>Sign In</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
