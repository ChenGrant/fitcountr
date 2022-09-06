import { Box } from "@mui/material";
import useScreenSize from "../../../hooks/useScreenSize";
import DailyProgressCard from "./DailyProgressCard";
import MacroPieChart from "./MacrosPieChart";
import { useTheme } from "@emotion/react";
import ProgressLineChart from "./ProgressLineChart";
import { useSelector } from "react-redux";
import { getDailyMacros, getDailyProgress } from "../utils";

const GAP_SIZE = 3;

const Dashboard = () => {
  const { desktop } = useScreenSize();
  const { user } = useSelector((state) => state);
  const theme = useTheme();

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
        {getDailyProgress(user).map((progress) => (
          <DailyProgressCard key={progress.progressType} {...progress} />
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
          <MacroPieChart macros={getDailyMacros(user, theme)} />
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
