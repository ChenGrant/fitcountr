import React from "react";
import CustomCard from "../../../components/ui/CustomCard";
import { Typography, Box, useTheme, IconButton } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
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

const ProgressLineChart = () => {
  const theme = useTheme();
  const { user } = useSelector((state) => state);
  const data = [...user.progress.weight].reverse();

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
            <Typography sx={{ fontWeight: 600 }} gutterBottom>
              Weight Progress
            </Typography>
          </Box>
          {/* <IconButton>
            <SettingsIcon />
          </IconButton> */}
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
              labels: data.map((dataEntry) =>
                new Date(dataEntry.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              ),
              datasets: [
                {
                  fill: true,
                  data: data.map((dataEntry) => dataEntry.weight.value),
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
