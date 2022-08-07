import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBarItem from "./NavigationBarItem";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { resetSearchFoodPages } from "../../../redux";

const NavigationBarItemList = ({ isOpen, setMenuIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();

  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      {/* Profile */}
      {/* <NavigationBarItem
        onClick={() => {
          setMenuIsOpen && setMenuIsOpen(false);
          navigate("/dashboard/profile");
        }}
        isOpen={isOpen}
        displayComponent={
          <Avatar
            alt="profilePic"
            src="https://i.stack.imgur.com/l60Hf.png"
            sx={!desktop ? { height: "35px", width: "35px" } : {}}
          />
        }
        name="Profile"
      /> */}
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
      {/* Search Food */}
      <NavigationBarItem
        onClick={() => {
          setMenuIsOpen && setMenuIsOpen(false);
          dispatch(resetSearchFoodPages());
          navigate("/dashboard/searchFood");
        }}
        isOpen={isOpen}
        displayComponent={<SearchIcon color="primary" />}
        name="Search Food"
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
