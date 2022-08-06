import { useTheme } from "@emotion/react";
import { LinearProgress, Pagination, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import CustomCard from "../../../components/ui/CustomCard";
import { v4 as uuidv4 } from "uuid";
import useScreenSize from "../../../hooks/useScreenSize";
import { AddPageContext, SetCurrentPageContext } from "../SearchFood";
import { SEARCH_FOOD_PAGES, fetchFoodsFromQuery } from "../../../utils";

const SearchFoodNameListTable = ({ foodData, foodName, setFoodData }) => {
  const { phone } = useScreenSize();
  const theme = useTheme();
  const [pageNumber, setPageNumber] = useState(1);
  const [fetching, setFetching] = useState(false);
  const setCurrentPage = useContext(SetCurrentPageContext);
  const addPage = useContext(AddPageContext);

  useEffect(() => {
    (async () => {
      setFetching(true);
      const fetchedFoodData = await fetchFoodsFromQuery(foodName, pageNumber);
      setFoodData(fetchedFoodData);
      setFetching(false);
    })();
  }, [pageNumber, foodName, setFoodData]);

  useEffect(() => setPageNumber(1), [foodName]);

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
        {foodData.foods.length === 0 ? (
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
              foodData.foods.map((food) => (
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
          count={foodData.totalPages}
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
