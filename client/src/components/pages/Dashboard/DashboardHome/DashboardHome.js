import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomButton from "../../../ui/CustomButton";
import { Typography } from "@mui/material";

const DashboardHome = () => {
  const auth = getAuth();
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();

  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <>
      <Typography>Hi {user.user.email}</Typography>
      <CustomButton
        variant="contained"
        onClick={async () => {
          await signOut(auth);
          navigate("/");
        }}
      >
        Logout
      </CustomButton>
    </>
  );
};

export default DashboardHome;
