import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import useAsset from "../../../hooks/useAsset";
import LoadingCircle from "../../miscellaneous/LoadingCircle";
import NavigationBarItemList from "./NavigationBarItemList";

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
const LargeScreenNavigationBar = ({ children }) => {
  const [animating, setAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [iconDirection, setIconDirection] = useState(RIGHT);
  const [hoveredAtLeastOnce, setHoveredAtLeastOnce] = useState(false);
  const [assets, assetsDispatchers, loadingAssets] = useAsset({
    shortLogo: { name: "short_logo" },
  });

  const pageIsLoading = loadingAssets;

  // ----------------------------------- FUNCTIONS -----------------------------------
  const toggleIconDirection = () =>
    iconDirection === LEFT ? setIconDirection(RIGHT) : setIconDirection(LEFT);

  // ---------------------------------- USE EFFECTS ----------------------------------
  useEffect(() => {
    !isOpen && setIconDirection(RIGHT);
  }, [isOpen]);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      {pageIsLoading && <LoadingCircle />}
      <Box display={pageIsLoading ? "none" : "flex"} fullWidth>
        {/* Navbar */}
        <Box
          height="calc(100vh - 2 * 23px)"
          p="23px"
          width={isOpen ? OPEN_SIDE_NAV_WIDTH : CLOSED_SIDE_NAV_WIDTH}
          boxShadow={4}
          display="flex"
          flexDirection="column"
          alignItems={!isOpen && "center"}
          onMouseOver={() => {
            if (animating) return;
            setAnimating(true);
            setIsOpen(true);
            setHoveredAtLeastOnce(true);
          }}
          onAnimationEnd={() => setAnimating(false)}
          onMouseLeave={() => iconDirection === RIGHT && setIsOpen(false)}
          sx={{
            overflow: "scroll",
            "::-webkit-scrollbar": {
              display: "none",
            },
            animation: isOpen
              ? `${grow} 0.25s ease-in-out`
              : hoveredAtLeastOnce && `${shrink} 0.25s ease-in-out`,
          }}
        >
          {/* Logo and Navigation Bar expansion */}
          <Box
            height="75px"
            minHeight="75px"
            display="flex"
            alignItems="center"
          >
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
          {/* NavigationBarItemList */}
          <NavigationBarItemList
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setIconDirection={setIconDirection}
          />
        </Box>
        {/* Body */}
        {!pageIsLoading && (
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
        )}
      </Box>
    </>
  );
};

export default LargeScreenNavigationBar;
