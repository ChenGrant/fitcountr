import React from "react";
import { SEARCH_FOOD_PAGES } from "../../utils";
import SelectSearchMethod from "./SelectSearchMethod/SelectSearchMethod";
import SearchBarcodeImage from "./SearchBarcodeImage/SearchBarcodeImage";
import SearchBarcodeNumber from "./SearchBarcodeNumber/SearchBarcodeNumber";
import SearchFoodName from "./SearchFoodName/SearchFoodName";
import FoodData from "./FoodData/FoodData";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ------------------------------------ CONSTANTS ------------------------------------
const {
  SELECT_SEARCH_METHOD,
  SEARCH_BARCODE_IMAGE,
  SEARCH_BARCODE_NUMBER,
  SEARCH_FOOD_NAME,
  FOOD_DATA,
} = SEARCH_FOOD_PAGES;

// ------------------------------------- CONTEXTS -------------------------------------

const getCurrentSearchFoodPage = (searchFoodPage) => searchFoodPage.peek();

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SearchFood = () => {
  const { user, searchFoodPage } = useSelector((state) => state);

  // ------------------------------------- RENDER -------------------------------------
  if (!user.isLoggedIn) return <Navigate to="/" />;

  const { name, barcodeImageFile, foodData, foodName, barcodeNumber } =
    getCurrentSearchFoodPage(searchFoodPage);

  switch (name) {
    case SELECT_SEARCH_METHOD:
      return <SelectSearchMethod />;

    case SEARCH_BARCODE_IMAGE:
      return <SearchBarcodeImage initialBarcodeImageFile={barcodeImageFile} />;

    case SEARCH_BARCODE_NUMBER:
      return <SearchBarcodeNumber initialBarcodeNumber={barcodeNumber} />;

    case SEARCH_FOOD_NAME:
      return <SearchFoodName initialFoodName={foodName} />;

    case FOOD_DATA:
      return (
        <FoodData
          initialBarcodeNumber={barcodeNumber}
          initialFoodData={foodData}
        />
      );

    default:
      return null;
  }
};

export default SearchFood;
