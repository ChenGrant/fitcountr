import { Box, Typography } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import CustomButton from "../../../mui/CustomButton";

const Dashboard = () => {
  const auth = getAuth();
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();

  //if (!user.isInitialized) return null;

  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <Box>
      <Typography>Hi {user.email}</Typography>
      <CustomButton
        variant="contained"
        onClick={async () => {
          await signOut(auth);
          navigate("/");
        }}
      >
        Logout
      </CustomButton>
    </Box>
  );
};

export default Dashboard;
