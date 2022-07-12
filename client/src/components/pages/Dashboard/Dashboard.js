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
    <>
      <div>Dashboard</div>
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

export default Dashboard;
