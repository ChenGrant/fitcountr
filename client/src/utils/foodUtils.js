export const SEARCH_FOOD_PAGES = {
  SELECT_SEARCH_METHOD: "SELECT_SEARCH_METHOD",
  SEARCH_BARCODE_IMAGE: "SEARCH_BARCODE_IMAGE",
  SEARCH_BARCODE_NUMBER: "SEARCH_BARCODE_NUMBER",
  SEARCH_FOOD_NAME: "SEARCH_FOOD_NAME",
  FOOD_DATA: "FOOD_DATA",
};

const USDA_NUTRIENT_SET = new Set([
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

export const getCleanFoodData = (rawFoodData) => {
  const cleanFoodData = {
    name: rawFoodData.description,
    servingSize: {
      value: 100,
      unit: "g",
    },
    nutrients: {},
  };

  rawFoodData.foodNutrients
    .filter(({ nutrientName }) => USDA_NUTRIENT_SET.has(nutrientName))
    .forEach(({ nutrientName, value, unitName }) => {
      if (nutrientName === "Energy") {
        cleanFoodData.nutrients["calories"] = value;
        return;
      }

      const propertyName = (() => {
        switch (nutrientName) {
          case "Carbohydrate, by difference":
            return "carbohydrates";

          case "Protein":
            return "proteins";

          case "Total lipid (fat)":
            return "fat";

          case "Sodium, Na":
            return "sodium";

          default:
            return nutrientName;
        }
      })();

      cleanFoodData.nutrients[propertyName.toLowerCase()] = {
        value,
        unit: unitName.toLowerCase(),
      };
    });

  return cleanFoodData;
};
