import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Box } from "@mui/system";
import CustomCard from "../../../../ui/CustomCard";
import { Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import useScreenSize from "../../../../../hooks/useScreenSize";

ChartJS.register(ArcElement, Tooltip, Legend);

const MacrosPieChart = ({ macros }) => {
  const { desktop } = useScreenSize();
  return (
    <CustomCard
      sx={{ height: desktop ? "calc(100% - 2 * 3 * 8px)" : "max-content" }}
    >
      <Box display="flex" flexDirection="column" gap={1.8}>
        <Typography sx={{ fontWeight: 600 }}>Macronutrients</Typography>
        <Box width={desktop ? "100%" : "max(30vw, 130px)"}>
          <Pie
            height="100%"
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
            data={{
              labels: macros.map(({ label }) => label),
              datasets: [
                {
                  data: macros.map(({ value }) => value),
                  backgroundColor: macros.map(({ color }) => color),
                  borderWidth: 3,
                },
              ],
            }}
          />
        </Box>
        {macros.map((macro) => {
          return (
            <Box key={uuidv4()} display="flex" alignItems="center" gap={1}>
              <Box
                bgcolor={macro.color}
                minHeight="10px"
                minWidth="10px"
                borderRadius="100%"
              />
              <Typography sx={{ fontWeight: 600 }}>
                {macro.label}: {macro.value}
                {macro.unit}, +2{macro.unit} of goal
              </Typography>
            </Box>
          );
        })}
      </Box>
    </CustomCard>
  );
};

export default MacrosPieChart;
