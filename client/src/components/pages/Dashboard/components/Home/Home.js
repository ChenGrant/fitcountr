import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useScreenSize from "../../../../../hooks/useScreenSize";
import { v4 as uuidv4 } from "uuid";
import DailyProgressCard from "./DailyProgressCard";
import MacroPieChart from "./MacrosPieChart";
import { capitalizeFirstCharacter } from "../../../../../utils";
import { useTheme } from "@emotion/react";
import LoadingCircle from "../../../../ui/LoadingCircle";

const dailyProgressData = [
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

const macrosData = [
  { label: "fats", value: 13, unit: "g" },
  { label: "proteins", value: 23, unit: "g" },
  { label: "carbohydrates", value: 3, unit: "g" },
];

const GAP_SIZE = 3;

const Home = () => {
  const { user } = useSelector((state) => state);
  const { desktop } = useScreenSize();
  const theme = useTheme();
  const { primary } = theme.palette;
  const [macros, setMacros] = useState([]);
  const [fetchingMacros, setFetchingMacros] = useState(true);

  const loading = fetchingMacros;

  useEffect(() => {
    const getMacros = async () => {
      await new Promise((r) => setTimeout(r, 2000));
      const responseData = macrosData;

      responseData.forEach((macro) => {
        macro.label = capitalizeFirstCharacter(macro.label);
      });

      responseData[0]["color"] = primary.light;
      responseData[1]["color"] = primary.main;
      responseData[2]["color"] = primary.dark;
      setMacros(responseData);
      setFetchingMacros(false);
    };
    getMacros();
  }, [primary]);

  if (!user.isLoggedIn) return <Navigate to="/" />;

  if (loading) return <LoadingCircle />;

  return (
    <Box p={4} display="flex" flexDirection="column" gap={GAP_SIZE}>
      {/* Daily Progress Cards */}
      <Box
        display="flex"
        flexDirection={desktop ? "row" : "column"}
        gap={GAP_SIZE}
        alignItems="center"
        justifyContent="center"
        fullWidth
      >
        {dailyProgressData.map((stat) => (
          <DailyProgressCard key={uuidv4()} {...stat} />
        ))}
      </Box>
      <Box
        display="flex"
        flexDirection={desktop ? "row" : "column"}
        fullWidth
        alignItems={!desktop && "center"}
      >
        <Box display="grid" sx={{ placeItems: !desktop && "center" }} width="100%">
          <MacroPieChart macros={macros} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
