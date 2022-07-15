import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Box } from "@mui/system";
import CustomCard from "../../../mui/CustomCard";
import { useTheme } from "@emotion/react";
import { Typography } from "@mui/material";
ChartJS.register(ArcElement, Tooltip, Legend);

const PieGraphChartjs = () => {
  const theme = useTheme();
  const { primary } = theme.palette;
  const rawData = [
    { label: "fats", value: 13, color: primary.light },
    { label: "protein", value: 23, color: primary.main },
    { label: "carbs", value: 3, color: primary.dark },
  ];

  return (
    <CustomCard sx={{ width: "400px", height: "450px" }}>
      <Typography sx={{ fontWeight: 600 }}>Macronutrients Breakdown</Typography>
      <Box>
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
            labels: rawData.map(({ label }) => label),
            datasets: [
              {
                label: "# of Votes",
                data: rawData.map(({ value }) => value),
                backgroundColor: rawData.map(({ color }) => color),
                // borderColor: [
                //   "rgba(255, 99, 132, 1)",
                //   "rgba(54, 162, 235, 1)",
                //   "rgba(255, 206, 86, 1)",
                //   "rgba(75, 192, 192, 1)",
                //   "rgba(153, 102, 255, 1)",
                //   "rgba(255, 159, 64, 1)",
                // ],
                borderWidth: 1,
              },
            ],
          }}
        />
      </Box>
    </CustomCard>
  );
};

export default PieGraphChartjs;
