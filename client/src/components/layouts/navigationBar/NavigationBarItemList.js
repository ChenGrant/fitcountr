import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationBarItem from "./NavigationBarItem";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import FoodBankIcon from '@mui/icons-material/FoodBank';
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  resetProgressPageType,
  resetSearchFoodPages,
  setProgressPageType,
  setUserProfilePictureIsLoading,
} from "../../../redux";
import { ROUTE_PATHS } from "../../../setup/routes/routeUtils";
import { PROGRESS_TYPES } from "../../../utils";
import { Avatar, Icon } from "@mui/material";

// -------------------------------- CONSTANTS --------------------------------

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const NavigationBarItemList = ({ isOpen, setMenuIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();
  const { user } = useSelector((state) => state);

  const NAVIGATION_BAR_ITEMS = [
    // Profile
    {
      name: "Profile",
      icon: (
        <Icon>
          <Avatar
            alt="profilePicture"
            src={user.profilePicture.URL}
            style={{ borderRadius: "100%", height: "24px", width: "24px" }}
            onLoad={() => dispatch(setUserProfilePictureIsLoading(false))}
          />
        </Icon>
      ),
      onClick: () => navigate(ROUTE_PATHS.PROFILE),
    },
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
    // My Foods
    {
      name: "My Foods",
      icon: <FoodBankIcon />,
      onClick: () => navigate(ROUTE_PATHS.MY_FOODS),
    },
    // Progress
    {
      name: "Progress",
      icon: <TrendingUpIcon />,
      nestedItems: Object.values(PROGRESS_TYPES).map((progressType) => ({
        name: progressType,
        onClick: () => {
          dispatch(setProgressPageType(progressType));
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
      {...item}
      key={item.name}
      nestedItems={item.nestedItems?.map((nestedItem) => ({
        ...nestedItem,
        onClick: () => {
          item.name !== "Search Food" && dispatch(resetSearchFoodPages());
          item.name !== "Progress" && dispatch(resetProgressPageType());
          nestedItem.onClick();
          setMenuIsOpen && setMenuIsOpen(false);
        },
      }))}
      icon={{
        ...item.icon,
        ...(item.name !== "Profile" && { props: { color: "primary" } }),
      }}
      isOpen={isOpen}
      onClick={() => {
        item.name !== "Search Food" && dispatch(resetSearchFoodPages());
        item.name !== "Progress" && dispatch(resetProgressPageType());
        setMenuIsOpen && setMenuIsOpen(false);
        item.onClick();
      }}
    />
  ));
};

export default NavigationBarItemList;
