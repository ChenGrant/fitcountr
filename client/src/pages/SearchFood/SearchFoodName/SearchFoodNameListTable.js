import { useTheme } from "@emotion/react";
import { LinearProgress, Pagination, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import CustomCard from "../../../components/ui/CustomCard";
import { v4 as uuidv4 } from "uuid";
import useScreenSize from "../../../hooks/useScreenSize";
import { AddPageContext } from "../SearchFood";
import { SEARCH_FOOD_PAGES, fetchFoodsFromQuery } from "../../../utils";

const SearchFoodNameListTable = ({
  setFoodNameErrorPopupIsOpen,
  foodData,
  foodDataDispatch,
  FOOD_DATA_ACTIONS,
}) => {
  const { phone } = useScreenSize();
  const theme = useTheme();
  const [pageNumber, setPageNumber] = useState(1);
  const [fetching, setFetching] = useState(true);
  const addPage = useContext(AddPageContext);

  useEffect(() => {
    (async () => {
      if (foodData.name.trim() === "") return setFoodNameErrorPopupIsOpen(true);
      setFetching(true);
      const fetchedFoodData = await fetchFoodsFromQuery(
        foodData.name,
        pageNumber
      );
      foodDataDispatch({
        type: FOOD_DATA_ACTIONS.SET_LIST,
        payload: fetchedFoodData,
      });
      setFetching(false);
    })();
  }, [
    pageNumber,
    foodData.name,
    foodDataDispatch,
    FOOD_DATA_ACTIONS.SET_LIST,
    setFoodNameErrorPopupIsOpen,
  ]);

  useEffect(() => setPageNumber(1), [foodData.name]);

  return (
    <CustomCard
      sx={
        phone
          ? { p: 2, width: "calc(100% - 2 * 2 * 8px)" }
          : { maxWidth: "800px" }
      }
    >
      <Typography variant="h4" gutterBottom>
        <b>Food Name</b>
      </Typography>
      <Box my={1.5}>
        {foodData.list.foods.length === 0 ? (
          <Typography>No matches found</Typography>
        ) : (
          <Box
            minHeight="410px"
            display={fetching && "grid"}
            sx={fetching ? { placeItems: "center" } : {}}
          >
            {fetching ? (
              <LinearProgress sx={{ width: "75%", maxWidth: "400px" }} />
            ) : (
              foodData.list.foods.map((food) => (
                <React.Fragment key={uuidv4()}>
                  <Box fullWidth height="1px" bgcolor="#D3D3D3" />
                  <Typography
                    p={1}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#ededed" },
                    }}
                    onClick={() => {
                      addPage({
                        name: SEARCH_FOOD_PAGES.FOOD_DATA,
                        foodData: food,
                      });
                    }}
                  >
                    {food.description}
                  </Typography>
                </React.Fragment>
              ))
            )}
          </Box>
        )}
      </Box>
      <Box display="grid" sx={{ placeItems: "center" }}>
        <Pagination
          disabled={fetching}
          count={foodData.list.totalPages}
          page={pageNumber}
          onChange={(e, pageNumber) => setPageNumber(pageNumber)}
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

export default SearchFoodNameListTable;
