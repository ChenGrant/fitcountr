import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CustomButton from "../../../components/ui/CustomButton";
import useScreenSize from "../../../hooks/useScreenSize";
import MyFoodsTable from "./MyFoodsTable";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const MyFoods = () => {
  const { desktop } = useScreenSize();

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box
      px={4}
      py={!desktop && 10}
      height={desktop ? "100vh" : "auto"}
      display="flex"
      flexDirection="column"
      gap={5}
      alignItems="center"
      justifyContent="center"
    >
      {/* Header */}
      <Typography variant="h1" textAlign="center">
        My Foods
      </Typography>
      {/* My Foods Table */}
      <MyFoodsTable />
      {/* Search/Add Food */}
      <Box display="flex" gap={2}>
        <CustomButton variant="contained" onClick={() => console.log("hi")}>
          Search Food
        </CustomButton>
        <CustomButton variant="contained" onClick={() => console.log("hi")}>
          Add Custom Food
        </CustomButton>
      </Box>
    </Box>
  );
};

export default MyFoods;
