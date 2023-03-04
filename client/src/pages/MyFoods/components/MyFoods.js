import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/ui/CustomButton";
import useScreenSize from "../../../hooks/useScreenSize";
import { ROUTE_PATHS } from "../../../setup/routes/routeUtils";
import { MyFoodsPageDispatchProvider } from "../context/MyFoodsPageDispatchContext";
import { MY_FOODS_PAGES } from "../utils";
import AddCustomFood from "./AddCustomFood";
import FoodDetails from "./FoodDetails";
import MyFoodsTable from "./MyFoodsTable";

const { MY_FOODS, FOOD_DETAILS, ADD_CUSTOM_FOOD } = MY_FOODS_PAGES;

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const MyFoods = () => {
  const { desktop } = useScreenSize();
  const navigate = useNavigate();
  const [page, setPage] = useState({ name: MY_FOODS });

  // ------------------------------------- RENDER -------------------------------------
  switch (page.name) {
    case MY_FOODS:
      return (
        <MyFoodsPageDispatchProvider value={setPage}>
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
              <CustomButton
                variant="contained"
                onClick={() => navigate(ROUTE_PATHS.SEARCH_FOOD)}
              >
                Search Food
              </CustomButton>
              <CustomButton
                variant="contained"
                onClick={() => setPage({ name: ADD_CUSTOM_FOOD })}
              >
                Add Custom Food
              </CustomButton>
            </Box>
          </Box>
        </MyFoodsPageDispatchProvider>
      );
    case FOOD_DETAILS:
      return (
        <FoodDetails
          food={page.food}
          backArrowOnClick={() => setPage({ name: MY_FOODS })}
        />
      );
    case ADD_CUSTOM_FOOD:
      return (
        <AddCustomFood backArrowOnClick={() => setPage({ name: MY_FOODS })} />
      );
    default:
      return;
  }
};

export default MyFoods;
