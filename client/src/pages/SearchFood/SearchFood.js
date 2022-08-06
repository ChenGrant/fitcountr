import React, { useEffect, useState } from "react";
import { SEARCH_FOOD_PAGES, Stack } from "../../utils";
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
export const SetCurrentPageContext = React.createContext();
export const AddPageContext = React.createContext();
export const RemovePageContext = React.createContext();

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SearchFood = () => {
  const { user } = useSelector((state) => state);
  const [pageStack, setPageStack] = useState(() => {
    const stack = new Stack();
    stack.push({ name: SEARCH_FOOD_PAGES.SELECT_SEARCH_METHOD });
    return stack;
  });

  // ----------------------------------- FUNCTIONS -----------------------------------
  const copyPageStack = (pageStack) =>
    Object.assign(Object.create(Object.getPrototypeOf(pageStack)), pageStack);

  const getCurrentPage = (pageStack) => pageStack.peek();

  const setCurrentPage = (newCurrentPage) => {
    removePage();
    addPage(newCurrentPage);
  };

  const addPage = (page) => {
    const pageStackCopy = copyPageStack(pageStack);
    pageStackCopy.push(page);
    setPageStack(pageStackCopy);
  };

  const removePage = () => {
    const pageStackCopy = copyPageStack(pageStack);
    const poppedPage = pageStackCopy.pop();
    setPageStack(pageStackCopy);
    return poppedPage;
  };

  useEffect(() => console.log(pageStack.items), [pageStack]);
  // ------------------------------------- RENDER -------------------------------------
  if (!user.isLoggedIn) return <Navigate to="/" />;


  return (
    <SetCurrentPageContext.Provider value={setCurrentPage}>
      <AddPageContext.Provider value={addPage}>
        <RemovePageContext.Provider value={removePage}>
          {(() => {
            const {
              name,
              barcodeImageFile,
              foodData,
              foodName,
              barcodeNumber,
            } = getCurrentPage(pageStack);

            switch (name) {
              case SELECT_SEARCH_METHOD:
                return <SelectSearchMethod />;

              case SEARCH_BARCODE_IMAGE:
                return (
                  <SearchBarcodeImage
                    initialBarcodeImageFile={barcodeImageFile}
                  />
                );

              case SEARCH_BARCODE_NUMBER:
                return (
                  <SearchBarcodeNumber initialBarcodeNumber={barcodeNumber} />
                );

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
          })()}
        </RemovePageContext.Provider>
      </AddPageContext.Provider>
    </SetCurrentPageContext.Provider>
  );
};

export default SearchFood;
