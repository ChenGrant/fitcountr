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
  PAGES,
  fetchFoodsFromQuery,
} from "../../../utils/";
import useScreenSize from "../../../hooks/useScreenSize";
import FoodDataTable from "./FoodDataTable";
import FoodNameErrorPopup from "./FoodNameErrorPopup";
import BackArrow from "../../../components/ui/BackArrow";

const FoodName = ({ initialFoodName = "" }) => {
  const { desktop, tablet } = useScreenSize();
  const setCurrentPage = useContext(SetCurrentPageContext);

  const [foodNameInputField, setFoodNameInputField] = useState(initialFoodName);
  const [foodName, setFoodName] = useState(initialFoodName);
  const [fetchingFoodData, setFetchingFoodData] = useState(false);
  const [foodNameErrorPopupIsOpen, setFoodNameErrorPopupIsOpen] =
    useState(false);
  const [foodData, setFoodData] = useState({});

  const handleSearchFoodName = async (foodNameInputField) => {
    if (!objectIsEmpty(foodData) && foodNameInputField === foodName) return;

    setFoodName(foodNameInputField);
    setFetchingFoodData(true);
    await (async () => {
      if (!foodNameInputField) return setFoodNameErrorPopupIsOpen(true);
      const fetchedFoodList = await fetchFoodsFromQuery(foodNameInputField);
      if (fetchedFoodList.error) return setFoodNameErrorPopupIsOpen(true);
      setCurrentPage({ name: PAGES.FOOD_NAME, foodName: foodNameInputField });
      setFoodData(fetchedFoodList);
    })();

    setFetchingFoodData(false);
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
          maxWidth="600px"
          display="flex"
          flexDirection={objectIsEmpty(foodData) || !desktop ? "column" : "row"}
          alignItems="center"
          gap={objectIsEmpty(foodData) ? 5 : 2}
        >
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Food Name</InputLabel>
            <OutlinedInput
              label={"Food Name"}
              type="input"
              value={foodNameInputField}
              onChange={(e) => setFoodNameInputField(e.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                handleSearchFoodName(foodNameInputField);
              }}
              variant="outlined"
              placeholder="Ex: chicken breast, raw"
              startAdornment={<SearchIcon sx={{ color: "black", pr: 1 }} />}
            />
          </FormControl>
          <Box
            width={objectIsEmpty(foodData) || !desktop ? "100%" : "200px"}
            display="grid"
            sx={{ placeItems: "center" }}
          >
            {fetchingFoodData ? (
              <CircularProgress color="primary" thickness={4} size={50} />
            ) : (
              <CustomButton
                sx={
                  objectIsEmpty(foodData) || !desktop
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
