import { Avatar, Box, IconButton, Slide, Typography } from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { Navigate, Outlet } from "react-router-dom";
import useAsset from "../../../../hooks/useAsset";
import useScreenSize from "../../../../hooks/useScreenSize";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAuth, signOut } from "firebase/auth";
import { useSelector } from "react-redux";

const SmallNavigationBar = () => {
  const auth = getAuth();
  const { user } = useSelector((state) => state);
  const { tablet } = useScreenSize();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  
  // ------------------------------------- RENDER -------------------------------------
  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <>
      {/* Fixed Navigation Bar */}
      <Box
        height='60px'
        display="flex"
        alignItems="center"
        position="fixed"
        zIndex={999999}
      >
        <IconButton
          sx={{ position: "fixed", margin: "0px 20px", right: "0px" }}
          onClick={() => setMenuIsOpen(true)}
          size="large"
        >
          <MenuIcon fontSize="inherit" color="primary" />
        </IconButton>
      </Box>
      {/* Navigation Menu that slides in */}
      <Slide direction="left" in={menuIsOpen} timeout={tablet ? 400 : 0}>
        <Box
          position="fixed"
          top={0}
          right={0}
          height="100vh"
          width="70vw"
          maxWidth="500px"
          padding="30px"
          bgcolor="white"
          sx={{
            zIndex: 999999,
            boxShadow: 4,
          }}
        >
          <Box onClick={() => setMenuIsOpen(false)}>
            <IconButton size="large">
              <ClearIcon color="primary" fontSize="inherit" />
            </IconButton>
          </Box>
          {/* Profile */}
          <Box
            height="50px"
            display="flex"
            alignItems="center"
            borderRadius="10px"
            px={2}
            gap={2}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(145, 158, 171, 0.12)",
              },
            }}
          >
            <Avatar
              alt="profilePic"
              src="https://mui.com/static/images/avatar/1.jpg"
              sx={{ height: "35px", width: "35px" }}
            />
            <Typography>Profile</Typography>
          </Box>
          {/* Dashboard */}
          <Box
            height="50px"
            display="flex"
            alignItems="center"
            px={2}
            borderRadius="10px"
            gap={2}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(145, 158, 171, 0.12)",
              },
            }}
          >
            <DashboardIcon color="primary" />
            <Typography>Dashboard</Typography>
          </Box>
          {/* Logout */}
          <Box
            height="50px"
            display="flex"
            alignItems="center"
            px={2}
            borderRadius="10px"
            gap={2}
            sx={{
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(145, 158, 171, 0.12)",
              },
            }}
            onClick={() => signOut(auth)}
          >
            <LogoutIcon color="primary" />
            <Typography>Logout</Typography>
          </Box>
        </Box>
      </Slide>
      {/* Body */}
      <Outlet />
    </>
  );
};

export default SmallNavigationBar;
