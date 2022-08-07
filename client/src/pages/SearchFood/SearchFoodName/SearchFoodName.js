import React, { useContext, useState } from "react";
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
import {
  objectIsEmpty,
  SEARCH_FOOD_PAGES,
  fetchFoodsFromQuery,
} from "../../../utils";
import useScreenSize from "../../../hooks/useScreenSize";
import SearchFoodNameListTable from "./SearchFoodNameListTable";
import FoodNameErrorPopup from "./SearchFoodNameErrorPopup";
import BackArrow from "../../../components/ui/BackArrow";

const SearchFoodName = ({ initialFoodName = "" }) => {
  const { desktop, tablet } = useScreenSize();
  const setCurrentPage = useContext(SetCurrentPageContext);

  const [foodNameInputField, setFoodNameInputField] = useState(initialFoodName);
  const [foodName, setFoodName] = useState(initialFoodName);
  const [fetchingFoodListData, setFetchingFoodListData] = useState(false);
  const [foodNameErrorPopupIsOpen, setFoodNameErrorPopupIsOpen] =
    useState(false);
  const [foodListData, setFoodListData] = useState({});

  const handleSearchFoodName = async (foodNameInputField) => {
    if (!objectIsEmpty(foodListData) && foodNameInputField === foodName) return;

    setFoodName(foodNameInputField);
    setFetchingFoodListData(true);
    await (async () => {
      if (!foodNameInputField) return setFoodNameErrorPopupIsOpen(true);
      const fetchedFoodList = await fetchFoodsFromQuery(foodNameInputField);
      if (fetchedFoodList.error) return setFoodNameErrorPopupIsOpen(true);
      setCurrentPage({
        name: SEARCH_FOOD_PAGES.SEARCH_FOOD_NAME,
        foodName: foodNameInputField,
      });
      setFoodListData(fetchedFoodList);
    })();

    setFetchingFoodListData(false);
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
        {objectIsEmpty(foodListData) && (
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
          flexDirection={
            objectIsEmpty(foodListData) || !desktop ? "column" : "row"
          }
          alignItems="center"
          gap={objectIsEmpty(foodListData) ? 5 : 2}
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
            width={objectIsEmpty(foodListData) || !desktop ? "100%" : "200px"}
            display="grid"
            sx={{ placeItems: "center" }}
          >
            {fetchingFoodListData ? (
              <CircularProgress color="primary" thickness={4} size={50} />
            ) : (
              <CustomButton
                sx={
                  objectIsEmpty(foodListData) || !desktop
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
        {!objectIsEmpty(foodListData) && (
          <SearchFoodNameListTable
            foodListData={foodListData}
            foodName={foodName}
            setFoodListData={setFoodListData}
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

export default SearchFoodName;
