import { Box, Card, Typography } from "@mui/material";
import React from "react";
import {
  capitalizeFirstCharacter,
  numberWithCommas,
  sub,
} from "../../../utils";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const DailyStatCard = ({ stat, goal, current }) => {
  return (
    <Card
      sx={{
        py: 3,
        px: 5,
        boxShadow: 4,
        borderRadius: "10px",
        width: "100%",
        minWidth: "max-content",
      }}
    >
      <Box bgcolor="white" display="flex" flexDirection="column" gap={1.8}>
        <Typography sx={{ fontWeight: 600 }}>
          {capitalizeFirstCharacter(stat)}
        </Typography>
        <Box display="flex" alignItems="center" gap={1.5}>
          {current === goal ? (
            <>
              <Box
                height="24px"
                width="24px"
                borderRadius="100%"
                bgcolor="rgba(211, 211, 211, 0.16)"
                color="gray"
                display="grid"
                sx={{ placeItems: "center" }}
              >
                <TrendingFlatIcon sx={{ height: "16px" }} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>
                +{numberWithCommas(sub(current, goal))} of goal
              </Typography>
            </>
          ) : current < goal ? (
            <>
              <Box
                height="24px"
                width="24px"
                borderRadius="100%"
                bgcolor="rgba(255, 72, 66, 0.16)"
                color="rgb(255, 72, 66)"
                display="grid"
                sx={{ placeItems: "center" }}
              >
                <TrendingDownIcon sx={{ height: "16px" }} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>
                {numberWithCommas(sub(current, goal))} of goal
              </Typography>
            </>
          ) : (
            <>
              <Box
                height="24px"
                width="24px"
                borderRadius="100%"
                bgcolor="rgba(84, 214, 44, 0.16)"
                color="rgb(84, 214, 44)"
                display="grid"
                sx={{ placeItems: "center" }}
              >
                <TrendingUpIcon sx={{ height: "16px" }} />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>
                +{numberWithCommas(sub(current, goal))} of goal
              </Typography>
            </>
          )}
        </Box>
        <Typography variant="h4">{numberWithCommas(current)}</Typography>
      </Box>
    </Card>
  );
};

export default DailyStatCard;
