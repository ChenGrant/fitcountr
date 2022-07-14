import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import CustomCard from "../../../mui/CustomCard";

const LineChart = () => {
  const theme = useTheme();

  return (
    <CustomCard sx={{ flex: 4 }}>
      <Box>
        <Typography sx={{ fontWeight: 600 }}>Weight Progress</Typography>
        <Chart
          options={
            {
              chart: {
                fontFamily: "Montserrat, sans-serif",
                type: "line",
                animations: {
                  enabled: true,
                  easing: "easeinout",
                  speed: 232800,
                  animateGradually: {
                    enabled: true,
                    delay: 150,
                  },
                  dynamicAnimation: {
                    enabled: true,
                    speed: 150,
                  },
                },
              },
              stroke: {
                curve: "straight",
              },
              colors: [theme.palette.primary.main, "rgba(0, 0, 0,0.3)"],
              yaxis: {
                tickAmount: 6,
                forceNiceScale: true,
                labels: {
                  style: {
                    fontSize: "14px",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                  },
                },
              },
              xaxis: {
                tickAmount: 15,
                labels: {
                  style: {
                    fontSize: "14px",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                  },
                  rotate: 0,
                },
              },
            }
          }
          series={[
            {
              name: "weight",
              data: [
                64.9, 64.55, 64.95, 64.65, 64.45, 64.45, 64.45, 64.45, 64.9,
                65.15, 65.15, 65.15, 65.15, 64.65, 65, 65, 65,
              ],
            },
          ]}
          type="line"
          height="460px"
        />
      </Box>
    </CustomCard>
  );
};

export default LineChart;
