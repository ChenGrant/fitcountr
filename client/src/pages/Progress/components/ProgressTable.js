import { Box, Checkbox, Typography } from "@mui/material";
import React from "react";
import CustomCard from "../../../components/ui/CustomCard";
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

const goal = 65;

const ProgressTable = (data = filteredData) => {
  return (
    <Box sx={{ display: "grid", placeItems: "center", width: "max-content" }}>
      <CustomCard>
        <Box display="flex" alignItems="center" gap={2} width="max-content">
          <Box>
            <Checkbox />
          </Box>
          <Box width="200px">
            <Typography sx={{ fontWeight: 600 }}>Weight (kg)</Typography>
          </Box>
          <Box width="400px">
            <Typography sx={{ fontWeight: 600 }}>Date (EST)</Typography>
          </Box>
          <Box width="300px">
            <Typography sx={{ fontWeight: 600 }}>
              Goal Difference(kg)
            </Typography>
          </Box>
        </Box>
        {Array.from(Array(10).keys()).map((_, index) => {
          const weight = ((Math.random() * 10000) / 100).toFixed(2);
          const goalDiff = (weight - goal).toFixed(2);
          return (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              gap={2}
              width="max-content"
              borderTop="1px solid #D3D3D3"
            >
              <Box>
                <Checkbox />
              </Box>
              <Box width="200px">
                <Typography>{weight}</Typography>
              </Box>
              <Box width="400px" display="flex" gap={3}>
                <Typography>Wed, Jan 23, 2022</Typography>
                <Typography>11:59 PM</Typography>
              </Box>
              <Box width="300px">
                <Typography>
                  {goalDiff >= 0 && "+"}{goalDiff}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </CustomCard>
    </Box>
  );
};

export default ProgressTable;
