import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";
import Chart from "react-apexcharts";
import CustomCard from "../../ui/CustomCard";

const MacroPieChart = () => {
  const theme = useTheme();
  return (
    <CustomCard sx={{ width: "382px" }}>
      <Box display="flex" flexDirection="column" gap={1.8}>
        <Typography sx={{ fontWeight: 600 }}>Macro nutrients</Typography>
        <Chart
          options={{
            chart: {
              fontFamily: "Montserrat, sans-serif",
              redrawOnWindowResize: true,
              parentHeightOffset: 0,
              horizontalAlign: "left",
              offsetX: 0,
            },
            labels: ["Carbs", "Protein", "Fats"],
            stroke: {
              width: 5,
            },
            legend: {
              position: "bottom",
              horizontalAlign: "left",
              fontSize: "16px",
              fontWeight: 600,
              width: 400,
              //offsetX: -35,
              formatter: (seriesName, opts) => [
                seriesName,
                ": ",
                opts.w.globals.series[opts.seriesIndex],
                "g, +2g of goal",
              ],
            },
            grid: {
              padding: {
                left: -209,
                //bottom: -15,
              },
            },
            colors: [
              theme.palette.primary.main,
              theme.palette.primary.light,
              theme.palette.primary.veryDark,
            ],
          }}
          series={[23, 33, 22]}
          type="pie"
          width="600"
        />
      </Box>
    </CustomCard>
  );
};

export default MacroPieChart;
