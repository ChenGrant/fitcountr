import { useTheme } from "@emotion/react";
import { Pagination, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomCard from "../../../components/ui/CustomCard";
import useScreenSize from "../../../hooks/useScreenSize";
import { objectIsEmpty } from "../../../utils";
import MyFoodsTableItem from "./MyFoodsTableItem";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const MyFoodsTable = () => {
  const FOOD_ITEMS_PER_PAGE = 10;
  const { phone } = useScreenSize();
  const theme = useTheme();
  const foods = Object.entries(useSelector((state) => state.user.foods)).map(
    (food) => ({
      id: food[0],
      ...food[1],
    })
  );
  const [pageNumber, setPageNumber] = useState(1);

  // ------------------------------------- RENDER -------------------------------------
  if (objectIsEmpty(foods))
    return (
      <Typography variant="h4" gutterBottom py={5}>
        You have no foods saved.
      </Typography>
    );

  return (
    <CustomCard
      sx={
        phone
          ? { p: 2, width: "calc(100% - 2 * 2 * 8px)" }
          : { maxWidth: "800px" }
      }
    >
      {/* List */}
      <Box my={1.5} minHeight="410px">
        {foods
          .slice(
            FOOD_ITEMS_PER_PAGE * (pageNumber - 1),
            FOOD_ITEMS_PER_PAGE * pageNumber
          )
          .map((food, index) => (
            <MyFoodsTableItem index={index} food={food} key={food.id} />
          ))}
      </Box>
      {/* Pagination */}
      <Box display="grid" sx={{ placeItems: "center" }}>
        <Pagination
          count={Math.ceil(foods.length / FOOD_ITEMS_PER_PAGE)}
          page={pageNumber}
          onChange={(e, newPageNumber) => setPageNumber(newPageNumber)}
          shape="rounded"
          color="primary"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "black",
              "&:hover": {
                background: theme.palette.primary.light,
              },
              "&.Mui-selected": {
                background: theme.palette.primary.main,
              },
            },
          }}
        />
      </Box>
    </CustomCard>
  );
};

export default MyFoodsTable;
