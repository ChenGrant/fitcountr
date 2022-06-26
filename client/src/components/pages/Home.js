import React, { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import SignIn from "./SignIn";
import Laptop from "../Laptop";
import useScreenSize from "../../hooks/useScreenSize";

const LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/fitcountr-staging.appspot.com/o/assets%2Flogo%2Flogo.svg?alt=media&token=e67a9e25-c187-4c85-a9f1-5d3d88e9cd90";

const LAPTOP_BACKGROUND =
  "https://store-wp.mui.com/wp-content/uploads/2021/12/preview-1.jpg";

const Home = () => {
  const [loadingLogo, setLoadingLogo] = useState(true);
  const firebaseClientIsInitialized = useSelector(
    (state) => state.firebaseClient.isInitialized
  );
  const { desktop } = useScreenSize();
  const loading = loadingLogo || !firebaseClientIsInitialized;
  return (
    <Box height={desktop && "100vh"} py={!desktop && "8vh"} px="5vw">
      {loading && <Loading />}
      <Box
        display={loading ? "none" : "flex"}
        flexDirection={desktop ? "row" : "column"}
        height={desktop && "100%"}
        justifyContent="center"
        alignItems="center"
        gap={desktop ? "5vw" : 10}
      >
        <Box
          width={desktop ? "700px" : "100%"}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={5}
        >
          <Box display="flex" justifyContent="center">
            <img
              style={{
                height: desktop && "60px",
                width: !desktop && "min(340px,100%)",
              }}
              alt="logo"
              onLoad={() => setLoadingLogo(false)}
              src={LOGO_URL}
            />
          </Box>
          <Box>
            <Typography variant="h6" textAlign="center">
              Counting calories couldn't be any easier.
            </Typography>
          </Box>
          <Box width="100%">
            <Laptop width="100%" imageURL={LAPTOP_BACKGROUND} />
          </Box>
        </Box>
        <SignIn />
      </Box>
    </Box>
  );
};

export default Home;
