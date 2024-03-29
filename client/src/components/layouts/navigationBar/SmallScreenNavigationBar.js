import { Box, IconButton, Slide } from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import NavigationBarItemList from "./NavigationBarItemList";

const SmallScreenNavigationBar = ({ children }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      {/* Fixed Navigation Bar */}
      <Box
        height="60px"
        minHeight="60px"
        display="flex"
        alignItems="center"
        position="fixed"
        zIndex={999999}
      >
        <IconButton
          sx={{ position: "fixed", margin: "0px 20px", right: "0px" }}
          onClick={() => setMenuIsOpen(true)}
          size="large"
          color="primary"
        >
          <MenuIcon fontSize="inherit" color="primary" />
        </IconButton>
      </Box>
      {/* Navigation Menu that slides in */}
      <Slide direction="left" in={menuIsOpen} timeout={400}>
        <Box
          position="fixed"
          top={0}
          right={0}
          height="calc(100vh - 2 * 25px)"
          maxWidth="500px"
          minWidth="200px"
          padding="25px"
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
      <Box
        flex={1}
        overflow="scroll"
        height="100vh"
        sx={{
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default SmallScreenNavigationBar;
