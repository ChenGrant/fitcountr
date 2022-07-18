import { Box, IconButton, Slide } from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import { Outlet } from "react-router-dom";
import useScreenSize from "../../../../../hooks/useScreenSize";
import NavigationBarItemList from "./NavigationBarItemList";

const SmallNavigationBar = () => {
  const { tablet } = useScreenSize();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      {/* Fixed Navigation Bar */}
      <Box
        height="60px"
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
          {/* NavigationBarItemList */}
          <NavigationBarItemList setMenuIsOpen={setMenuIsOpen} />
        </Box>
      </Slide>
      {/* Body */}
      <Box flex={1}>
        <Outlet />
      </Box>
    </>
  );
};

export default SmallNavigationBar;
