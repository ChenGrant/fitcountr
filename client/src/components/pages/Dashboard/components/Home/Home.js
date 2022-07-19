import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useScreenSize from "../../../../../hooks/useScreenSize";
import { v4 as uuidv4 } from "uuid";
import DailyProgressCard from "./DailyProgressCard";

const dailyProgress = [
  {
    stat: "calories",
    goal: 3000,
    current: 3000,
  },
  {
    stat: "weight",
    goal: 65.0,
    current: 15.6,
  },
  {
    stat: "steps",
    goal: 10000,
    current: 12330,
  },
];

const GAP_SIZE = 3;

const Home = () => {
  const { user } = useSelector((state) => state);
  const { desktop } = useScreenSize();

  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <Box p={4} fullWidth display="flex" flexDirection="column" gap={GAP_SIZE}>
      {/* Daily Progress Cards */}
      <Box
        display="flex"
        flexDirection={desktop ? "row" : "column"}
        gap={GAP_SIZE}
        alignItems="center"
        justifyContent="center"
        fullWidth
      >
        {dailyProgress.map((stat) => (
          <DailyProgressCard key={uuidv4()} {...stat} />
        ))}
      </Box>
    </Box>
  );
};

export default Home;
