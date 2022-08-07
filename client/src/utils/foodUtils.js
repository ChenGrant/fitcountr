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
  console.log(JSON.stringify(rawFoodData));
  const cleanFoodData = { ...rawFoodData };

  console.log(cleanFoodData);

  //const nutrients = Object.fromEntries(
  //   Object.entries(fetchedFood.data.product.nutriments)
  //     .filter(
  //       ([key, value]) =>
  //         key.endsWith("_100g") && key !== "energy_100g" && value !== 0
  //     )
  //     .map(([key, value]) => {
  //       switch (key) {
  //         case "energy-kcal_100g":
  //           return ["calories", value];
  //         case "saturated-fat_100g":
  //           return ["saturated fat", { value, unit: GRAM }];
  //         default:
  //           return [key.replace("_100g", ""), { value, unit: GRAM }];
  //       }
  //     })
  // );

  // const nutrients = Object.fromEntries(
  //   Object.entries(fetchedFood.data.product.nutriments)
  //     .filter(
  //       ([key, value]) =>
  //         key.endsWith("_100g") && key !== "energy_100g" && value !== 0
  //     )
  //     .map(([key, value]) => {
  //       switch (key) {
  //         case "energy-kcal_100g":
  //           return ["calories", value];
  //         case "saturated-fat_100g":
  //           return ["saturated fat", { value, unit: GRAM }];
  //         default:
  //           return [key.replace("_100g", ""), { value, unit: GRAM }];
  //       }
  //     })
  // );
  // console.log({ nutrients });
  return rawFoodData;
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

  return {
    name: rawFoodData.description,
    servingSize: {
      value: 100,
      unit: "g",
    },
    nutrients: Object.fromEntries(
      rawFoodData.foodNutrients
        .filter(({ nutrientName }) => USDA_NUTRIENT_MAP.get(nutrientName))
        .map(({ nutrientName, value, unitName }) => [
          USDA_NUTRIENT_MAP.get(nutrientName).toLowerCase(),
          {
            value,
            unit: nutrientName !== "Energy" ? unitName.toLowerCase() : null,
          },
        ])
    ),
  };
};
