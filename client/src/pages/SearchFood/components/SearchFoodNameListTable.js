import { useTheme } from "@emotion/react";
import { LinearProgress, Pagination, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import CustomCard from "../../../components/ui/CustomCard";
import useScreenSize from "../../../hooks/useScreenSize";
import { SEARCH_FOOD_PAGES, fetchFoodsFromQuery } from "../../../utils";
import { useDispatch } from "react-redux";
import { addSearchFoodPage } from "../../../redux";

const SearchFoodNameListTable = ({
  setFoodNameErrorPopupIsOpen,
  foodData,
  foodDataDispatch,
  FOOD_DATA_ACTIONS,
}) => {
  const { phone } = useScreenSize();
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      foodData.list.foodSearchCriteria.query === foodData.name &&
      foodData.list.currentPage === foodData.listPageNumber
    )
      return foodDataDispatch({
        type: FOOD_DATA_ACTIONS.SET_IS_FETCHING_NEW_LIST_PAGE,
        payload: false,
      });

    if (foodData.isFetchingNewListPage || foodData.isFetchingNewFood) return;

    // handleNewFoodListPage is executed when the page number changes
    const fetchFoodListPageData = async () => {
      if (foodData.name.trim() === "") return setFoodNameErrorPopupIsOpen(true);

      foodDataDispatch({
        type: FOOD_DATA_ACTIONS.SET_IS_FETCHING_NEW_LIST_PAGE,
        payload: true,
      });

      const fetchedFoodData = await fetchFoodsFromQuery(
        foodData.name,
        foodData.listPageNumber
      );

      if (fetchedFoodData.error) return setFoodNameErrorPopupIsOpen(true);

      foodDataDispatch({
        type: FOOD_DATA_ACTIONS.SET_LIST,
        payload: fetchedFoodData,
      });
      foodDataDispatch({
        type: FOOD_DATA_ACTIONS.SET_IS_FETCHING_NEW_LIST_PAGE,
        payload: false,
      });
    };
    fetchFoodListPageData();
  }, [
    FOOD_DATA_ACTIONS.SET_IS_FETCHING_NEW_LIST_PAGE,
    FOOD_DATA_ACTIONS.SET_LIST,
    foodData.isFetchingNewFood,
    foodData.list.currentPage,
    foodData.list.foodSearchCriteria.query,
    foodData.listPageNumber,
    foodData.name,
    foodDataDispatch,
    foodData.isFetchingNewListPage,
    setFoodNameErrorPopupIsOpen,
  ]);

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
            display={
              foodData.isFetchingNewListPage &&
              !foodData.isFetchingNewFood &&
              "grid"
            }
            sx={
              foodData.isFetchingNewListPage && !foodData.isFetchingNewFood
                ? { placeItems: "center" }
                : {}
            }
          >
            {foodData.isFetchingNewListPage && !foodData.isFetchingNewFood ? (
              <LinearProgress sx={{ width: "75%", maxWidth: "400px" }} />
            ) : (
              foodData.list.foods.map((food) => (
                <React.Fragment key={food.description}>
                  <Box fullWidth height="1px" bgcolor="#D3D3D3" />
                  <Typography
                    p={1}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#ededed" },
                    }}
                    onClick={() =>
                      dispatch(
                        addSearchFoodPage({
                          name: SEARCH_FOOD_PAGES.FOOD_DATA,
                          foodData: food,
                        })
                      )
                    }
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
          disabled={foodData.isFetchingNewListPage}
          count={foodData.list.totalPages}
          page={foodData.listPageNumber}
          onChange={(e, pageNumber) =>
            foodDataDispatch({
              type: FOOD_DATA_ACTIONS.SET_LIST_PAGE_NUMBER,
              payload: pageNumber,
            })
          }
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
