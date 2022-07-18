import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBarItem from "./NavigationBarItem";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmLogoutPopup from "./ConfirmLogoutPopup";
import useScreenSize from "../../../../../hooks/useScreenSize";

const NavigationBarItemList = ({
  isOpen,
  setMenuIsOpen,
  setIsOpen,
}) => {
  const { desktop } = useScreenSize();
  const [confirmLogoutPopupIsOpen, setConfirmLogoutPopupIsOpen] =
    useState(false);
  const navigate = useNavigate();

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
        onClick={() => {
          setIsOpen && setIsOpen(false);
          setMenuIsOpen && setMenuIsOpen(false);
          setConfirmLogoutPopupIsOpen(true);
        }}
        isOpen={isOpen}
        displayComponent={<LogoutIcon color="primary" />}
        name="Logout"
      />
      <ConfirmLogoutPopup
        setConfirmLogoutPopupIsOpen={setConfirmLogoutPopupIsOpen}
        confirmLogoutPopupIsOpen={confirmLogoutPopupIsOpen}
      />
    </>
  );
};

export default NavigationBarItemList;
