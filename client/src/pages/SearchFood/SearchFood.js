import React, { useState } from "react";
import { PAGES, Stack } from "../../utils";
import SelectSearchMethod from "./SelectSearchMethod/SelectSearchMethod";
import BarcodeImage from "./BarcodeImage/BarcodeImage";
import BarcodeNumber from "./BarcodeNumber/BarcodeNumber";
import NutritionalData from "./NutritionalData/NutritionalData";
import FoodName from "./FoodName/FoodName";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ------------------------------------ CONSTANTS ------------------------------------
const {
  SELECT_SEARCH_METHOD,
  BARCODE_IMAGE,
  BARCODE_NUMBER,
  FOOD_NAME,
  NUTRITIONAL_DATA,
} = PAGES;

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
    stack.push({ name: PAGES.SELECT_SEARCH_METHOD });
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

  // ------------------------------------- RENDER -------------------------------------
  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <SetCurrentPageContext.Provider value={setCurrentPage}>
      <AddPageContext.Provider value={addPage}>
        <RemovePageContext.Provider value={removePage}>
          {(() => {
            const currentPage = getCurrentPage(pageStack);
            const { name, file, food, foodName, barcodeNumber } = currentPage;

            switch (name) {
              case SELECT_SEARCH_METHOD:
                return <SelectSearchMethod />;

              case BARCODE_IMAGE:
                return <BarcodeImage initialFile={file} />;

              case BARCODE_NUMBER:
                return <BarcodeNumber initialBarcodeNumber={barcodeNumber} />;

              case FOOD_NAME:
                return <FoodName initialFoodName={foodName} />;

              case NUTRITIONAL_DATA:
                return (
                  <NutritionalData barcodeNumber={barcodeNumber} food={food} />
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
