import React from "react";
import CustomCard from "../../../../ui/CustomCard";
import { Typography, Box, useTheme, IconButton } from "@mui/material";
import { Line } from "react-chartjs-2";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const filteredData = [
  76.36, 76.2, 75.5, 75.36, 75.45, 75.35, 75.1, 74.65, 74.35, 74.55, 74.7,
  74.75, 74.7, 74.25, 74.2, 73.9, 74.15, 73.45, 73.55, 73.25, 73.1, 73.05,
  73.05, 72.2, 72.75, 72.25, 72.45, 72.05, 72, 71.15, 71.65, 71.2, 70.55, 70.55,
  70.65, 69.85, 69.8, 69.4, 69.7, 70.3, 69.55, 69.45, 69.5, 69.15, 68.7, 68.65,
  68.7, 68.35, 68.15, 68.35, 67.9, 67.9, 67.9, 67.85, 67.6, 67.55, 67.55, 67.1,
  67.9, 67.5, 67.75, 67.05, 67.3, 67.45, 67.2, 67.4, 66.85, 66.85, 66.85, 66.85,
  67.05, 66.75, 67.35, 66.65, 66.95, 66.2, 66.3, 66.7, 66.7, 66.8, 67.1, 66.65,
  65.7, 65.75, 65.85, 65.8, 65.45, 65.15, 65.9, 65.75, 65.65, 65.15, 65.3,
  65.45, 65.25, 65.25, 65.6, 66.15, 65.7, 65.1, 65.1, 65.65, 65.4, 65.45, 65.4,
  64.8, 64.8, 64.85, 65.15, 64.95, 65.05, 64.85, 64.8, 64.5, 65.15, 65.5, 65.5,
  65.25, 65.45, 64.55, 65.1, 65.15, 65.55, 64.85, 65.6, 65.35, 65.15, 65.5,
  65.5, 64.85, 64.95, 64.5, 65.1, 64.9, 64.7, 65.15, 65.1, 64.95, 64.8, 64.8,
  64.95, 65.75, 64.85, 65.15, 65.2, 65.25, 64.8, 64.55, 64.65, 65.5, 64.7, 64.7,
  64.65, 64.65, 64.25, 64.65, 64.85, 64.4, 64.9, 64.55, 64.95, 64.65, 64.45,
  64.45, 64.45, 64.45, 64.9, 65.15, 65.15, 65.15, 65.15, 64.65, 65, 65, 65,
  65.2, 64.9, 64.9, 64.9, 64.9, 65.15, 64.8, 65.05, 64.6, 65.05, 65.25, 65,
  64.65, 64.65, 65.2, 65.2, 65, 64.65, 64.85, 65.5, 65.5, 64.55, 64.3,
];

const ProgressLineChart = () => {
  const theme = useTheme();
  return (
    <CustomCard sx={{ height: "calc(100% - 2 * 3 * 8px)" }}>
      <Box
        display="flex"
        flexDirection="column"
        gap={1.8}
        height="100%"
        fullWidth
      >
        <Box display="flex">
          <Box flex={1}>
            <Typography sx={{ fontWeight: 600 }}>Weight Progress</Typography>
          </Box>
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </Box>
        <Box flex={1}>
          <Line
            height="100%"
            options={{
              maintainAspectRatio: false,
              responsive: true,
              animation: {
                tension: {
                  duration: 1000,
                  easing: "easeInQuad",
                  from: 1,
                  to: 0,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                  text: "Chart.js Line Chart",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Date",
                    font: {
                      family: "Montserrat,sans-serif",
                      size: 16,
                      weight: 600,
                    },
                    color: "black",
                    padding: {
                      top: 20,
                    },
                  },
                  ticks: {
                    display: true,
                    font: {
                      family: "Montserrat,sans-serif",
                      size: 16,
                      weight: 600,
                    },
                    color: "black",
                  },
                  grid: {
                    z: 1,
                    tickLength: 15,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Weight (kg)",
                    font: {
                      family: "Montserrat,sans-serif",
                      size: 16,
                      weight: 600,
                    },
                    color: "black",
                    padding: {
                      bottom: 20,
                    },
                  },
                  ticks: {
                    display: true,
                    font: {
                      family: "Montserrat,sans-serif",
                      size: 16,
                      weight: 600,
                    },
                    color: "black",
                  },
                  grid: {
                    z: 1,
                    tickLength: 15,
                  },
                },
              },
            }}
            data={{
              labels: filteredData.map((item, index) =>
                new Date(index * 100000000).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              ),
              datasets: [
                {
                  fill: true,
                  data: filteredData,
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light,
                },
              ],
            }}
          />
        </Box>
      </Box>
    </CustomCard>
  );
};

export default ProgressLineChart;
