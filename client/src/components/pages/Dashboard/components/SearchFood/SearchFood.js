import React, { useEffect, useState } from "react";
import { PAGES, Stack } from "../../../../../utils";
import SelectSearchMethod from "./SelectSearchMethod/SelectSearchMethod";
import BarcodeImage from "./BarcodeImage/BarcodeImage";
import BarcodeNumber from "./BarcodeNumber/BarcodeNumber";
import NutritionalData from "./NutritionalData/NutritionalData";
import FoodName from "./FoodName/FoodName";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

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
  const setCurrentPage = (newCurrentPage) => {
    removePage();
    addPage(newCurrentPage);
  };

  const addPage = (page) => {
    const pageStackCopy = Object.assign(
      Object.create(Object.getPrototypeOf(pageStack)),
      pageStack
    );
    pageStackCopy.push(page);
    setPageStack(pageStackCopy);
  };

  const removePage = () => {
    const pageStackCopy = Object.assign(
      Object.create(Object.getPrototypeOf(pageStack)),
      pageStack
    );
    const poppedPage = pageStackCopy.pop();
    setPageStack(pageStackCopy);
    return poppedPage;
  };

  // ----------------------------------- USE EFFECT -----------------------------------
  //useEffect(() => console.log(pageStack), [pageStack]);

  // ------------------------------------- RENDER -------------------------------------
  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <SetCurrentPageContext.Provider value={setCurrentPage}>
      <AddPageContext.Provider value={addPage}>
        <RemovePageContext.Provider value={removePage}>
          {(() => {
            const topPage = pageStack.peek();
            switch (topPage.name) {
              case PAGES.SELECT_SEARCH_METHOD:
                return <SelectSearchMethod />;
              case PAGES.BARCODE_IMAGE:
                return <BarcodeImage initialFile={topPage.file} />;
              case PAGES.BARCODE_NUMBER:
                return (
                  <BarcodeNumber initialBarcodeNumber={topPage.barcodeNumber} />
                );
              case PAGES.FOOD_NAME:
                return <FoodName initialFoodName={topPage.foodName} />;
              case PAGES.NUTRITIONAL_DATA:
                return (
                  <NutritionalData
                    barcodeNumber={topPage.barcodeNumber}
                    food={topPage.food}
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
