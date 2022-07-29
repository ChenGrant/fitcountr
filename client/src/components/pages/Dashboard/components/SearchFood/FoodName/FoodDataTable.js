import { useTheme } from "@emotion/react";
import {
  CircularProgress,
  LinearProgress,
  Pagination,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import CustomCard from "../../../../../ui/CustomCard";
import { v4 as uuidv4 } from "uuid";
import { fetchFoodListFromName } from "../../../../../../utils/fetchRequestUtils";

const FoodDataTable = ({ foodData, foodName, setFoodData }) => {
  const theme = useTheme();
  const [pageNumber, setPageNumber] = useState(1);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    (async () => {
      setFetching(true);
      const fetchedFoodData = await fetchFoodListFromName(foodName, pageNumber);
      setFoodData(fetchedFoodData);
      setFetching(false);
    })();
  }, [pageNumber]);

  return (
    <CustomCard sx={{ maxWidth: "800px" }}>
      <Typography variant="h4" gutterBottom>
        <b>Food Name</b>
      </Typography>
      <Box my={2}>
        {foodData.foods.length === 0 ? (
          <Typography>No matches found</Typography>
        ) : (
          <Box
            minHeight="410px"
            display={fetching && "grid"}
            sx={fetching ? { placeItems: "center" } : {}}
          >
            {fetching ? (
              <LinearProgress sx={{ width: "100%", maxWidth: "400px" }} />
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
                    onClick={() => console.log(food.description)}
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
          count={foodData.totalPages}
          page={pageNumber}
          onChange={(e, pageNumber) => !fetching && setPageNumber(pageNumber)}
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

export default FoodDataTable;
