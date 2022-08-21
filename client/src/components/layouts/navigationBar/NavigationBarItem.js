import { Collapse, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Box } from "@mui/system";
import React, { useState } from "react";
import useScreenSize from "../../../hooks/useScreenSize";
import ExpandMore from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { capitalizeOnlyFirstChar, sortArray } from "../../../utils";
import { useLocation } from "react-router-dom";
import { ROUTE_PATHS } from "../../../setup/routes/routeUtils";
import { useSelector } from "react-redux";

// -------------------------------- CONSTANTS --------------------------------
const ARROW_DIRECTIONS = {
  LEFT: "LEFT",
  DOWN: "DOWN",
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const NavigationBarItem = ({ isOpen, name, icon, nestedItems, ...rest }) => {
  const { desktop } = useScreenSize();
  const theme = useTheme();
  const [arrowDirection, setArrowDirection] = useState(ARROW_DIRECTIONS.LEFT);
  const { progressType } = useSelector((state) => state.progressPage);
  const pathName = useLocation().pathname;

  const isExpanded = !desktop || isOpen;
  const arrowDirectionIsDown = arrowDirection === ARROW_DIRECTIONS.DOWN;

  // ----------------------------------- FUNCTIONS -----------------------------------
  const toggleIconDirection = () =>
    setArrowDirection(
      arrowDirectionIsDown ? ARROW_DIRECTIONS.LEFT : ARROW_DIRECTIONS.DOWN
    );

  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      <Box
        minHeight={desktop ? "75px" : "60px"}
        display="flex"
        alignItems="center"
        px={isExpanded && 2}
        borderRadius="10px"
        gap={2}
        sx={{
          cursor: "pointer",
          "&:hover": {
            bgcolor: "rgba(145, 158, 171, 0.12)",
          },
        }}
        {...rest}
        onClick={nestedItems ? toggleIconDirection : rest.onClick}
      >
        {icon}
        {isExpanded && (
          <Typography
            sx={{
              flex: 1,
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </Typography>
        )}
        {isExpanded &&
          nestedItems &&
          (arrowDirectionIsDown ? (
            <ExpandMore color="primary" />
          ) : (
            <KeyboardArrowRightIcon color="primary" />
          ))}
      </Box>
      {/* Nested Items */}
      <Collapse in={isExpanded && arrowDirectionIsDown}>
        {nestedItems &&
          sortArray(nestedItems, (item1, item2) =>
            item1.name.localeCompare(item2.name)
          ).map(({ name, onClick }) => {
            const isSelected =
              pathName === ROUTE_PATHS.PROGRESS && progressType === name;

            return (
              <Box
                key={name}
                display="flex"
                alignItems="center"
                p={1}
                px={2}
                borderRadius="10px"
                gap={2}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(145, 158, 171, 0.12)",
                  },
                }}
                ml={3}
                onClick={onClick}
              >
                <Box
                  width="5px"
                  height="5px"
                  borderRadius="100%"
                  bgcolor={
                    isSelected
                      ? theme.palette.primary.main
                      : "rgba(0, 0, 0, 0.4)"
                  }
                />
                <Typography>{capitalizeOnlyFirstChar(name)}</Typography>
              </Box>
            );
          })}
      </Collapse>
    </>
  );
};

export default NavigationBarItem;
