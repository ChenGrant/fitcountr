import React from "react";
import { SEARCH_FOOD_PAGES } from "../../../utils";
import SelectSearchMethod from "./SelectSearchMethod";
import SearchBarcodeImage from "./SearchBarcodeImage";
import SearchBarcodeNumber from "./SearchBarcodeNumber";
import SearchFoodName from "./SearchFoodName";
import FoodData from "./FoodData";
import { useSelector } from "react-redux";

// ------------------------------------ CONSTANTS ------------------------------------
const {
  SELECT_SEARCH_METHOD,
  SEARCH_BARCODE_IMAGE,
  SEARCH_BARCODE_NUMBER,
  SEARCH_FOOD_NAME,
  FOOD_DATA,
} = SEARCH_FOOD_PAGES;

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SearchFood = () => {
  const { searchFoodPage } = useSelector((state) => state);

  // ------------------------------------- RENDER -------------------------------------
  const { name, barcodeImageFile, foodData, foodName, barcodeNumber } =
    searchFoodPage.peek();

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
