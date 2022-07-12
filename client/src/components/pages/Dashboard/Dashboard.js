import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../mui/CustomButton";

const Dashboard = () => {
  const auth = getAuth();
  const navigate = useNavigate();

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
