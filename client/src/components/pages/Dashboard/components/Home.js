import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { user } = useSelector((state) => state);

  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <Box fullWidth bgcolor="green">
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
      Home
      <br />
    </Box>
  );
};

export default Home;
