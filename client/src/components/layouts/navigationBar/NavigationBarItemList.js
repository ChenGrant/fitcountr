import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBarItem from "./NavigationBarItem";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { resetSearchFoodPages, setProgressPageStat } from "../../../redux";
import { ROUTE_PATHS } from "../../../setup/routes/routeUtils";
import {
  capitalizeFirstCharacterLowercaseRest,
  PROGRESS_TYPES,
} from "../../../utils";

const NavigationBarItemList = ({ isOpen, setMenuIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();

  const NAVIGATION_BAR_ITEMS = [
    // Profile
    // {
    //   name: "Profile",
    //   onClick: () => {
    //     setMenuIsOpen && setMenuIsOpen(false);
    //     navigate("/dashboard/profile");
    //   },
    //   icon: (
    //     <Avatar
    //       alt="profilePic"
    //       src="https://i.stack.imgur.com/l60Hf.png"
    //       sx={!desktop ? { height: "35px", width: "35px" } : {}}
    //     />
    //   ),
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
        name: capitalizeFirstCharacterLowercaseRest(progressType),
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
      icon={{ ...item.icon, props: { color: "primary" } }}
      isOpen={isOpen}
      onClick={() => {
        setMenuIsOpen && setMenuIsOpen(false);
        item.onClick();
      }}
    />
  ));
};

export default NavigationBarItemList;
