import { Box, Checkbox, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import CustomCard from "../../../components/ui/CustomCard";
import { PROGRESS_TYPE_NAMES } from "../../../utils";

const ProgressTable = () => {
  const { progressPage, user } = useSelector((state) => state);

  const { progressType } = progressPage;
  const singularProgress = PROGRESS_TYPE_NAMES[progressType].singular;
  const progressData = user.progress[singularProgress];

  return (
    <Box sx={{ display: "grid", placeItems: "center", width: "max-content" }}>
      <CustomCard>
        <Box display="flex" alignItems="center" gap={2} width="max-content">
          <Box width="200px">
            <Typography sx={{ fontWeight: 600 }}>Weight (kg)</Typography>
          </Box>
          <Box width="400px">
            <Typography sx={{ fontWeight: 600 }}>Date</Typography>
          </Box>
          <Box width="200px">
            <Typography sx={{ fontWeight: 600 }}>
              Goal Difference(kg)
            </Typography>
          </Box>
        </Box>
        {Array.from(Array(10).keys()).map((_, index) => {
          const weight = ((Math.random() * 10000) / 100).toFixed(2);
          const goalDiff = (weight - user.goals[singularProgress].value).toFixed(2);
          return (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              gap={2}
              width="max-content"
              borderTop="1px solid #D3D3D3"
            >
              <Box width="200px">
                <Typography>{weight}</Typography>
              </Box>
              <Box width="400px" display="flex" gap={3}>
                <Typography>Wed, Jan 23, 2022</Typography>
                <Typography>11:59 PM</Typography>
              </Box>
              <Box width="200px">
                <Typography>
                  {goalDiff >= 0 && "+"}
                  {goalDiff}
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
