import { NutrientPrioritySet } from "./";

export const SEARCH_FOOD_PAGES = {
  SELECT_SEARCH_METHOD: "SELECT_SEARCH_METHOD",
  SEARCH_BARCODE_IMAGE: "SEARCH_BARCODE_IMAGE",
  SEARCH_BARCODE_NUMBER: "SEARCH_BARCODE_NUMBER",
  SEARCH_FOOD_NAME: "SEARCH_FOOD_NAME",
  FOOD_DATA: "FOOD_DATA",
};

const NUTRIENT_PRIORITY_SET = new NutrientPrioritySet([
  "calories",
  "protein",
  "carbohydrate",
  "fat",
  "sugars",
  "sodium",
]);

export const sortByNutrient = (nutritionalData) =>
  nutritionalData.sort(([nutrient1], [nutrient2]) => {
    if (
      NUTRIENT_PRIORITY_SET.has(nutrient1) &&
      NUTRIENT_PRIORITY_SET.has(nutrient2)
    )
      return (
        NUTRIENT_PRIORITY_SET.indexOf(nutrient1) -
        NUTRIENT_PRIORITY_SET.indexOf(nutrient2)
      );
    else if (NUTRIENT_PRIORITY_SET.has(nutrient1)) return -1;
    else if (NUTRIENT_PRIORITY_SET.has(nutrient2)) return 1;
    return nutrient1 - nutrient2;
  });

export const cleanFoodsFetchedFromBarcodeNumber = (rawFoodData) => {
  const OPEN_FOOD_FACTS_NUTRIENT_MAP = new Map(
    Object.entries({
      "energy-kcal": "calories",
      proteins: "protein",
      carbohydrates: "carbohydrate",
      fat: "fat",
      sugars: "sugars",
      sodium: "sodium",
    })
  );

  let nutrients = {};
  Object.keys(rawFoodData.nutrients).forEach((nutrientName) => {
    const mappedNutrientName = OPEN_FOOD_FACTS_NUTRIENT_MAP.get(nutrientName);
    if (!mappedNutrientName) return;
    nutrients[mappedNutrientName] = {
      value: rawFoodData.nutrients[`${nutrientName}_100g`],
      unit: rawFoodData.nutrients[`${nutrientName}_unit`].toLowerCase(),
    };
  });

  return { ...rawFoodData, nutrients };
};

export const cleanFoodsFetchedFromQuery = (rawFoodData) => {
  const USDA_NUTRIENT_MAP = new Map(
    Object.entries({
      Energy: "calories",
      Protein: "protein",
      "Carbohydrate, by difference": "carbohydrate",
      "Total lipid (fat)": "fat",
      Sugars: "sugars",
      "Sodium, Na": "sodium",
    })
  );

  const nutrients = Object.fromEntries(
    rawFoodData.foodNutrients
      .filter(({ nutrientName }) => USDA_NUTRIENT_MAP.get(nutrientName))
      .map(({ nutrientName, value, unitName }) => [
        USDA_NUTRIENT_MAP.get(nutrientName),
        { value, unit: unitName.toLowerCase() },
      ])
  );

  return {
    name: rawFoodData.description,
    servingSize: {
      value: 100,
      unit: "g",
    },
    nutrients,
  };
};
