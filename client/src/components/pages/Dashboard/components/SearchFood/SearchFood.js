import React, { useState } from "react";
import { Stack } from "../../../../../utils";
import SelectSearchMethod from "./SelectSearchMethod";
import BarcodeImage from "./BarcodeImage";
import { PAGES } from "../../../../../utils";
import BarcodeNumber from "./BarcodeNumber";

// ------------------------------------- CONTEXTS -------------------------------------
export const PushPageContext = React.createContext();
export const PopPageContext = React.createContext();

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SearchFood = () => {
  const [pageStack, setPageStack] = useState(() => {
    const stack = new Stack();
    stack.push({ name: PAGES.SELECT_SEARCH_METHOD });
    return stack;
  });

  // ----------------------------------- FUNCTIONS -----------------------------------
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
        return <BarcodeImage />;
      case PAGES.BARCODE_NUMBER:
        return <BarcodeNumber initialBarcodeNumber={topPage.barcodeNumber} />;
      default:
        return null;
    }
  };

  // ------------------------------------- RENDER -------------------------------------
  if (pageStack.isEmpty()) return null;

  return (
    <PushPageContext.Provider value={pushPage}>
      <PopPageContext.Provider value={popPage}>
        {renderPage()}
      </PopPageContext.Provider>
    </PushPageContext.Provider>
  );
};

export default SearchFood;
