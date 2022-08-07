import React, { useContext, useReducer, useState } from "react";
import { SetCurrentPageContext } from "../SearchFood";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../../components/ui/CustomButton";
import { SEARCH_FOOD_PAGES, fetchFoodsFromQuery } from "../../../utils";
import useScreenSize from "../../../hooks/useScreenSize";
import SearchFoodNameListTable from "./SearchFoodNameListTable";
import FoodNameErrorPopup from "./SearchFoodNameErrorPopup";
import BackArrow from "../../../components/ui/BackArrow";

const FOOD_DATA_ACTIONS = {
  SET_IS_FETCHING: "SET_IS_FETCHING",
  SET_NAME: "SET_NAME",
  SET_LIST: "SET_LIST",
};

const foodDataReducer = (state, action) => {
  switch (action.type) {
    case FOOD_DATA_ACTIONS.SET_NAME:
      return { ...state, name: action.payload };
    case FOOD_DATA_ACTIONS.SET_IS_FETCHING:
      return { ...state, isFetching: action.payload };
    case FOOD_DATA_ACTIONS.SET_LIST:
      return { ...state, list: action.payload };
    default:
      return state;
  }
};

const SearchFoodName = ({ initialFoodName = "" }) => {
  const { desktop, tablet } = useScreenSize();
  const setCurrentPage = useContext(SetCurrentPageContext);
  const [foodNameInputField, setFoodNameInputField] = useState(initialFoodName);
  const [foodData, foodDataDispatch] = useReducer(foodDataReducer, {
    isFetching: false,
    name: initialFoodName ?? null,
    list: null,
  });
  const [foodNameErrorPopupIsOpen, setFoodNameErrorPopupIsOpen] =
    useState(false);

  const handleSearchFoodName = async (foodNameInputField) => {
    if (foodData.list && foodNameInputField === foodData.name) return;

    foodDataDispatch({
      type: FOOD_DATA_ACTIONS.SET_NAME,
      payload: foodNameInputField.trim(),
    });

    foodDataDispatch({
      type: FOOD_DATA_ACTIONS.SET_IS_FETCHING,
      payload: true,
    });
    await (async () => {
      if (foodNameInputField.trim() === "")
        return setFoodNameErrorPopupIsOpen(true);
      const fetchedFoodList = await fetchFoodsFromQuery(foodNameInputField);
      if (fetchedFoodList.error) return setFoodNameErrorPopupIsOpen(true);
      setCurrentPage({
        name: SEARCH_FOOD_PAGES.SEARCH_FOOD_NAME,
        foodName: foodNameInputField,
      });
      foodDataDispatch({
        type: FOOD_DATA_ACTIONS.SET_LIST,
        payload: fetchedFoodList,
      });
    })();

    foodDataDispatch({
      type: FOOD_DATA_ACTIONS.SET_IS_FETCHING,
      payload: false,
    });
  };

  return (
    <>
      <BackArrow />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={5}
        px={desktop ? 5 : tablet ? 3 : 2}
        pb={5}
      >
        {!foodData.list && (
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
          maxWidth="600px"
          display="flex"
          flexDirection={!foodData.list || !desktop ? "column" : "row"}
          alignItems="center"
          gap={!foodData.list ? 5 : 2}
        >
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Food Name</InputLabel>
            <OutlinedInput
              label={"Food Name"}
              type="input"
              value={foodNameInputField}
              onChange={(e) => setFoodNameInputField(e.target.value)}
              onKeyDown={(event) =>
                event.key === "Enter" &&
                handleSearchFoodName(foodNameInputField)
              }
              variant="outlined"
              placeholder="Ex: chicken breast, raw"
              startAdornment={<SearchIcon sx={{ color: "black", pr: 1 }} />}
            />
          </FormControl>
          <Box
            width={!foodData.list || !desktop ? "100%" : "200px"}
            display="grid"
            sx={{ placeItems: "center" }}
          >
            {foodData.isFetching ? (
              <CircularProgress color="primary" thickness={4} size={50} />
            ) : (
              <CustomButton
                sx={
                  !foodData.list || !desktop
                    ? { width: "100%" }
                    : { px: 3, borderRadius: "5px" }
                }
                variant="contained"
                onClick={() => handleSearchFoodName(foodNameInputField)}
              >
                Search
              </CustomButton>
            )}
          </Box>
        </Box>
        {foodData.list && (
          <SearchFoodNameListTable
            foodData={foodData}
            FOOD_DATA_ACTIONS={FOOD_DATA_ACTIONS}
            foodDataDispatch={foodDataDispatch}
            setFoodNameErrorPopupIsOpen={setFoodNameErrorPopupIsOpen}
          />
        )}
      </Box>
      <FoodNameErrorPopup
        foodName={foodData.name}
        foodNameErrorPopupIsOpen={foodNameErrorPopupIsOpen}
        setFoodNameErrorPopupIsOpen={setFoodNameErrorPopupIsOpen}
      />
    </>
  );
};

export default SearchFoodName;
