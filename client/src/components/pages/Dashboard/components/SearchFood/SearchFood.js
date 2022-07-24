import React, { useState } from "react";
import { Stack } from "../../../../../utils";
import SelectSearchMethod from "./SelectSearchMethod";
import BarcodeImage from "./BarcodeImage";

// ------------------------------------ CONSTANTS ------------------------------------

const PAGES = {
  SELECT_SEARCH_METHOD: "SELECT_SEARCH_METHOD",
  BARCODE_IMAGE: "BARCODE_IMAGE",
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const SearchFood = () => {
  const [pageStack, setPageStack] = useState(() => {
    const stack = new Stack();
    stack.push(PAGES.SELECT_SEARCH_METHOD);
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

  // ------------------------------------- RENDER -------------------------------------
  if (pageStack.isEmpty()) return null;

  switch (pageStack.peek()) {
    case "SELECT_SEARCH_METHOD":
      return <SelectSearchMethod pushPage={pushPage} PAGES={PAGES} />;
    case "BARCODE_IMAGE":
      return (
        <BarcodeImage popPage={popPage} pushPage={pushPage} PAGES={PAGES} />
      );
    default:
      return null;
  }
};

export default SearchFood;
