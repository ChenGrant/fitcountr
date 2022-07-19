import { Avatar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBarItem from "./NavigationBarItem";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import useScreenSize from "../../../../../hooks/useScreenSize";
import { getAuth, signOut } from "firebase/auth";

const NavigationBarItemList = ({ isOpen, setMenuIsOpen }) => {
  const { desktop } = useScreenSize();
  const navigate = useNavigate();
  const auth = getAuth();

  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      {/* Profile */}
      <NavigationBarItem
        onClick={() => {
          setMenuIsOpen && setMenuIsOpen(false);
          navigate("/dashboard/profile");
        }}
        isOpen={isOpen}
        displayComponent={
          <Avatar
            alt="profilePic"
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={!desktop ? { height: "35px", width: "35px" } : {}}
          />
        }
        name="Profile"
      />
      {/* Dashboard */}
      <NavigationBarItem
        onClick={() => {
          setMenuIsOpen && setMenuIsOpen(false);
          navigate("/dashboard");
        }}
        isOpen={isOpen}
        displayComponent={<DashboardIcon color="primary" />}
        name="Dashboard"
      />
      {/* Logout */}
      <NavigationBarItem
        onClick={() => signOut(auth)}
        isOpen={isOpen}
        displayComponent={<LogoutIcon color="primary" />}
        name="Logout"
      />
    </>
  );
};

export default NavigationBarItemList;
