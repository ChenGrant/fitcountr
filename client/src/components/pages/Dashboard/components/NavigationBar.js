import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { keyframes } from "@emotion/react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import useAsset from "../../../../hooks/useAsset";
import LoadingCircle from "../../../ui/LoadingCircle";

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
const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [iconDirection, setIconDirection] = useState(RIGHT);
  const [hoveredAtLeastOnce, setHoveredAtLeastOnce] = useState(false);
  const [assets, assetsDispatchers, loadingAssets] = useAsset({
    shortLogo: { name: "short_logo" },
  });

  const pageIsLoading = loadingAssets;

  const toggleIconDirection = () => {
    iconDirection === LEFT ? setIconDirection(RIGHT) : setIconDirection(LEFT);
  };

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
          onMouseEnter={() => {
            setIsOpen(true);
            setHoveredAtLeastOnce(true);
          }}
          onMouseLeave={() => iconDirection === RIGHT && setIsOpen(false)}
          sx={{
            animation: isOpen
              ? `${grow} 0.2s ease-in-out`
              : hoveredAtLeastOnce && `${shrink} 0.2s ease-in-out`,
          }}
        >
          {/* Logo and Navigation Bar expansion */}
          <Box height="60px" bgcolor="white" display="flex" alignItems="center">
            <Box
              component="img"
              src={assets.shortLogo.src}
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
        </Box>
        {/* Outlet */}
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default NavigationBar;
