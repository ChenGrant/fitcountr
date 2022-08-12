import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import useScreenSize from "../../../hooks/useScreenSize";
import DailyProgressCard from "./DailyProgressCard";
import MacroPieChart from "./MacrosPieChart";
import { capitalizeFirstCharacter } from "../../../utils";
import { useTheme } from "@emotion/react";
import ProgressLineChart from "./ProgressLineChart";
import LoadingCircle from "../../../components/miscellaneous/LoadingCircle";

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

const Dashboard = () => {
  const { desktop } = useScreenSize();
  const theme = useTheme();
  const { primary } = theme.palette;
  const [macros, setMacros] = useState([]);
  const [fetchingMacros, setFetchingMacros] = useState(true);

  const loading = fetchingMacros;

  useEffect(() => {
    const getMacros = async () => {
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

  if (loading) return <LoadingCircle />;

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      gap={GAP_SIZE}
      height={desktop ? "calc(100vh - 2 * 4 * 8px)" : "auto"}
    >
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
          <DailyProgressCard key={stat.stat} {...stat} />
        ))}
      </Box>
      <Box
        flex={desktop && 1}
        fullWidth
        display="flex"
        flexDirection={desktop ? "row" : "column"}
        alignItems={!desktop && "center"}
        gap={GAP_SIZE}
      >
        <Box
          display="grid"
          sx={{ placeItems: !desktop && "center" }}
          flex={desktop && 2}
          width={desktop ? "min(450px, 25vw)" : "100%"}
        >
          <MacroPieChart macros={macros} />
        </Box>
        <Box
          display="grid"
          sx={{ placeItems: !desktop && "center" }}
          flex={desktop && 5}
          width={!desktop && "100%"}
          height={desktop ? "auto" : "max(70vw, 400px)"}
        >
          <ProgressLineChart />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
