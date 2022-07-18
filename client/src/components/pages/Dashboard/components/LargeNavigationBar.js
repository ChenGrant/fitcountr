import { Avatar, Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import useAsset from "../../../../hooks/useAsset";
import LoadingCircle from "../../../ui/LoadingCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useSelector } from "react-redux";
import ConfirmLogoutPopup from "./ConfirmLogoutPopup";

// ------------------------------------ CONSTANTS ------------------------------------
const OPEN_SIDE_NAV_WIDTH = "233px";
const CLOSED_SIDE_NAV_WIDTH = "41px";

const grow = keyframes({
  from: { width: CLOSED_SIDE_NAV_WIDTH },
  to: { width: OPEN_SIDE_NAV_WIDTH },
});
const shrink = keyframes({
  from: { width: OPEN_SIDE_NAV_WIDTH },
  to: { width: CLOSED_SIDE_NAV_WIDTH },
});

const LEFT = "LEFT";
const RIGHT = "RIGHT";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const LargeNavigationBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const [animating, setAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [iconDirection, setIconDirection] = useState(RIGHT);
  const [hoveredAtLeastOnce, setHoveredAtLeastOnce] = useState(false);
  const [assets, assetsDispatchers, loadingAssets] = useAsset({
    shortLogo: { name: "short_logo" },
  });
  const [confirmLogoutPopupIsOpen, setConfirmLogoutPopupIsOpen] =
    useState(false);

  const pageIsLoading = loadingAssets;

  // ----------------------------------- FUNCTIONS -----------------------------------
  const toggleIconDirection = () => {
    iconDirection === LEFT ? setIconDirection(RIGHT) : setIconDirection(LEFT);
  };

  // ------------------------------------- RENDER -------------------------------------
  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <>
      {pageIsLoading && <LoadingCircle />}
      <Box display={pageIsLoading ? "none" : "flex"} fullWidth>
        {/* Navbar */}
        <Box
          height="calc(100vh - 2 * 23px)"
          p="23px"
          overflow="hidden"
          width={isOpen ? OPEN_SIDE_NAV_WIDTH : CLOSED_SIDE_NAV_WIDTH}
          boxShadow={4}
          display="flex"
          flexDirection="column"
          alignItems={!isOpen && "center"}
          onMouseEnter={() => {
            if (animating) return;
            setAnimating(true);
            setIsOpen(true);
            setHoveredAtLeastOnce(true);
          }}
          onAnimationEnd={() => setAnimating(false)}
          onMouseLeave={() => iconDirection === RIGHT && setIsOpen(false)}
          sx={{
            animationFillMode: "forwards",
            animation: isOpen
              ? `${grow} 0.25s ease-in-out`
              : hoveredAtLeastOnce && `${shrink} 0.25s ease-in-out`,
          }}
        >
          {/* Logo and Navigation Bar expansion */}
          <Box height="75px" bgcolor="white" display="flex" alignItems="center">
            <Box
              component="img"
              src={assets.shortLogo.src}
              pl={isOpen && 2}
              alt="favicon"
              height="31px"
              bgcolor="white"
              onLoad={() => assetsDispatchers.shortLogo.setLoading(false)}
            />
            {isOpen && (
              <Box flex={1} display="flex" justifyContent="right">
                <IconButton
                  color="primary"
                  onClick={() => isOpen && toggleIconDirection()}
                >
                  {iconDirection === RIGHT ? (
                    <KeyboardArrowRightIcon />
                  ) : (
                    <KeyboardArrowLeftIcon />
                  )}
                </IconButton>
              </Box>
            )}
          </Box>
          {/* Profile */}
          <Box
            height="75px"
            display="flex"
            alignItems="center"
            px={isOpen && 2}
            borderRadius="10px"
            gap={2}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(145, 158, 171, 0.12)",
              },
            }}
            onClick={() => navigate("/dashboard/profile")}
          >
            <Avatar
              alt="profilePic"
              src="https://mui.com/static/images/avatar/1.jpg"
            />
            {isOpen && <Typography>Profile</Typography>}
          </Box>
          {/* Dashboard */}
          <Box
            height="75px"
            display="flex"
            alignItems="center"
            px={isOpen && 2}
            borderRadius="10px"
            gap={2}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(145, 158, 171, 0.12)",
              },
            }}
            onClick={() => navigate("/dashboard/")}
          >
            <DashboardIcon color="primary" />
            {isOpen && <Typography>Dashboard</Typography>}
          </Box>
          {/* Logout */}
          <Box
            height="75px"
            display="flex"
            alignItems="center"
            px={isOpen && 2}
            borderRadius="10px"
            gap={2}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(145, 158, 171, 0.12)",
              },
            }}
            onClick={() => setConfirmLogoutPopupIsOpen(true)}
          >
            <LogoutIcon color="primary" />
            {isOpen && <Typography>Logout</Typography>}
          </Box>
        </Box>
        {/* Outlet */}
        <Box flex={1}>
          <Outlet />
        </Box>
        <ConfirmLogoutPopup
          setConfirmLogoutPopupIsOpen={setConfirmLogoutPopupIsOpen}
          confirmLogoutPopupIsOpen={confirmLogoutPopupIsOpen}
        />
      </Box>
    </>
  );
};

export default LargeNavigationBar;
