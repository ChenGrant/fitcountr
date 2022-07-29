import React, { useEffect, useState } from "react";
import { PAGES, Stack } from "../../../../../utils";
import SelectSearchMethod from "./SelectSearchMethod";
import BarcodeImage from "./BarcodeImage/BarcodeImage";
import BarcodeNumber from "./BarcodeNumber/BarcodeNumber";
import NutritionalData from "./NutritionalData";
import FoodName from "./FoodName/FoodName";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ------------------------------------- CONTEXTS -------------------------------------
export const SetTopPageContext = React.createContext();
export const PushPageContext = React.createContext();
export const PopPageContext = React.createContext();

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
  const setTopPage = (page) => {
    popPage();
    pushPage(page);
  };

  const pushPage = (page) => {
    const pageStackCopy = Object.assign(
      Object.create(Object.getPrototypeOf(pageStack)),
      pageStack
    );
    pageStackCopy.push(page);
    setPageStack(pageStackCopy);
  };

  const popPage = () => {
    const pageStackCopy = Object.assign(
      Object.create(Object.getPrototypeOf(pageStack)),
      pageStack
    );
    const poppedValue = pageStackCopy.pop();
    setPageStack(pageStackCopy);
    return poppedValue;
  };

  const renderPage = () => {
    const topPage = pageStack.peek();
    switch (topPage.name) {
      case PAGES.SELECT_SEARCH_METHOD:
        return <SelectSearchMethod />;
      case PAGES.BARCODE_IMAGE:
        return <BarcodeImage initialFile={topPage.file} />;
      case PAGES.BARCODE_NUMBER:
        return <BarcodeNumber initialBarcodeNumber={topPage.barcodeNumber} />;
      case PAGES.FOOD_NAME:
        return <FoodName initialFoodName={topPage.foodName} />;
      case PAGES.NUTRITIONAL_DATA:
        return <NutritionalData barcodeNumber={topPage.barcodeNumber} />;
      default:
        return null;
    }
  };

  // ----------------------------------- USE EFFECT -----------------------------------
  //useEffect(() => console.log(pageStack), [pageStack]);

  // ------------------------------------- RENDER -------------------------------------
  if (!user.isLoggedIn) return <Navigate to="/" />;

  return (
    <SetTopPageContext.Provider value={setTopPage}>
      <PushPageContext.Provider value={pushPage}>
        <PopPageContext.Provider value={popPage}>
          {renderPage()}
        </PopPageContext.Provider>
      </PushPageContext.Provider>
    </SetTopPageContext.Provider>
  );
};

export default SearchFood;
