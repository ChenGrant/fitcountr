import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBarItem from "./NavigationBarItem";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import {
  resetProgressPageStat,
  resetSearchFoodPages,
  setProgressPageStat,
} from "../../../redux";
import { ROUTE_PATHS } from "../../../setup/routes/routeUtils";
import { PROGRESS_TYPES } from "../../../utils";
//import { Icon } from "@mui/material";

// -------------------------------- CONSTANTS --------------------------------
// const PROFILE_PIC_SRC =
//   "https://180dc.org/wp-content/uploads/2016/08/default-profile.png";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const NavigationBarItemList = ({ isOpen, setMenuIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();

  const NAVIGATION_BAR_ITEMS = [
    // Profile
    // {
    //   name: "Profile",
    //   icon: (
    //     <Icon>
    //       <img
    //         alt="profilePicture"
    //         src={PROFILE_PIC_SRC}
    //         style={{ borderRadius: "100%", height: "24px", width: "24px" }}
    //       />
    //     </Icon>
    //   ),
    //   onClick: () => navigate(ROUTE_PATHS.PROFILE),
    // },
    // Dashboard
    {
      name: "Dashboard",
      icon: <DashboardIcon />,
      onClick: () => navigate(ROUTE_PATHS.DASHBOARD),
    },
    // Search Food
    {
      name: "Search Food",
      icon: <SearchIcon />,
      onClick: () => {
        dispatch(resetSearchFoodPages());
        navigate(ROUTE_PATHS.SEARCH_FOOD);
      },
    },
    // Progress
    {
      name: "Progress",
      icon: <TrendingUpIcon />,
      nestedItems: Object.values(PROGRESS_TYPES).map((progressType) => ({
        name: progressType,
        onClick: () => {
          dispatch(setProgressPageStat(progressType));
          navigate(ROUTE_PATHS.PROGRESS);
        },
      })),
    },
    // Logout
    {
      name: "Logout",
      icon: <LogoutIcon />,
      onClick: () => signOut(auth),
    },
  ];

  // ------------------------------------- RENDER -------------------------------------
  return NAVIGATION_BAR_ITEMS.map((item) => (
    <NavigationBarItem
      key={item.name}
      {...item}
      icon={{
        ...item.icon,
        ...(item.name !== "Profile" && { props: { color: "primary" } }),
      }}
      isOpen={isOpen}
      onClick={() => {
        item.name !== "Progress" && dispatch(resetProgressPageStat());
        setMenuIsOpen && setMenuIsOpen(false);
        item.onClick();
      }}
    />
  ));
};

export default NavigationBarItemList;
