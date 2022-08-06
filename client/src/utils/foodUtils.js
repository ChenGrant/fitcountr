export const SEARCH_FOOD_PAGES = {
  SELECT_SEARCH_METHOD: "SELECT_SEARCH_METHOD",
  SEARCH_BARCODE_IMAGE: "SEARCH_BARCODE_IMAGE",
  SEARCH_BARCODE_NUMBER: "SEARCH_BARCODE_NUMBER",
  SEARCH_FOOD_NAME: "SEARCH_FOOD_NAME",
  FOOD_DATA: "FOOD_DATA",
};

export const USDA_NUTRIENT_SET = new Set([
  "Protein",
  "Carbohydrate, by difference",
  "Energy",
  "Total lipid (fat)",
  "Sugars",
  "Sodium, Na",
]);

const NUTRIENT_PRIORITY = [
  "calories",
  "proteins",
  "carbohydrates",
  "fat",
  "sugars",
  "sodium",
];

export const sortByNutrient = (nutritionalData) =>
  nutritionalData.sort(([nutrient1], [nutrient2]) => {
    if (
      NUTRIENT_PRIORITY.includes(nutrient1) &&
      NUTRIENT_PRIORITY.includes(nutrient2)
    )
      return (
        NUTRIENT_PRIORITY.indexOf(nutrient1) -
        NUTRIENT_PRIORITY.indexOf(nutrient2)
      );
    else if (NUTRIENT_PRIORITY.includes(nutrient1)) return -1;
    else if (NUTRIENT_PRIORITY.includes(nutrient2)) return 1;
    return nutrient1 - nutrient2;
  });
