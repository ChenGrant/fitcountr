import React, { useContext, useState } from "react";
import { PopPageContext, SetTopPageContext } from "../SearchFood";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../../../../ui/CustomButton";
import { objectIsEmpty, PAGES } from "../../../../../../utils";
import useScreenSize from "../../../../../../hooks/useScreenSize";
import { fetchFoodListFromName } from "../../../../../../utils/fetchRequestUtils";
import FoodDataTable from "./FoodDataTable";
import FoodNameErrorPopup from "./FoodNameErrorPopup";

const FoodName = ({ initialFoodName = "" }) => {
  const { desktop } = useScreenSize();
  const popPage = useContext(PopPageContext);
  const setTopPage = useContext(SetTopPageContext);

  const [foodName, setFoodName] = useState(initialFoodName);
  const [fetchingFoodData, setFetchingFoodData] = useState(false);
  const [foodNameErrorPopupIsOpen, setFoodNameErrorPopupIsOpen] =
    useState(false);
  const [foodData, setFoodData] = useState({});

  const handleSearchFoodName = async (foodName) => {
    setFetchingFoodData(true);

    await (async () => {
      if (!foodName) return setFoodNameErrorPopupIsOpen(true);
      const fetchedFoodList = await fetchFoodListFromName(foodName);
      if (fetchedFoodList.error) return setFoodNameErrorPopupIsOpen(true);
      setTopPage({ name: PAGES.FOOD_NAME, foodName });
      setFoodData(fetchedFoodList);
    })();

    setFetchingFoodData(false);
  };

  return (
    <>
      <Box m={5}>
        <IconButton color="primary" onClick={popPage}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={desktop ? 10 : 5}
        px={desktop ? 5 : 2}
        pb={5}
      >
        {objectIsEmpty(foodData) && (
          <>
            <Typography variant="h4" textAlign="center">
              Enter a Food Name
            </Typography>
            <Typography textAlign="center">
              Search up a product's nutritional data via its name
            </Typography>
          </>
        )}
        <Box
          width="100%"
          maxWidth="500px"
          display="flex"
          flexDirection={objectIsEmpty(foodData) ? "column" : "row"}
          alignItems="center"
          gap={objectIsEmpty(foodData) ? 5 : 1}
        >
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Food Name</InputLabel>
            <OutlinedInput
              label={"Food Name"}
              type="input"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                handleSearchFoodName(foodName);
              }}
              variant="outlined"
              placeholder="Ex: chicken breast, raw"
              startAdornment={<SearchIcon sx={{ color: "black", pr: 1 }} />}
            />
          </FormControl>
          <Box
            width={objectIsEmpty(foodData) ? "100%" : "200px"}
            display="grid"
            sx={{ placeItems: "center" }}
          >
            {fetchingFoodData ? (
              <CircularProgress color="primary" thickness={4} size={50} />
            ) : (
              <CustomButton
                sx={
                  objectIsEmpty(foodData)
                    ? { width: "100%" }
                    : { px: 3, borderRadius: "5px" }
                }
                variant="contained"
                onClick={() => handleSearchFoodName(foodName)}
              >
                Search
              </CustomButton>
            )}
          </Box>
        </Box>
        {!objectIsEmpty(foodData) && (
          <FoodDataTable
            foodData={foodData}
            foodName={foodName}
            setFoodData={setFoodData}
          />
        )}
      </Box>
      <FoodNameErrorPopup
        foodName={foodName}
        foodNameErrorPopupIsOpen={foodNameErrorPopupIsOpen}
        setFoodNameErrorPopupIsOpen={setFoodNameErrorPopupIsOpen}
      />
    </>
  );
};

export default FoodName;
