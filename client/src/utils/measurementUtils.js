export const METRIC = "METRIC";
export const IMPERIAL = "IMPERIAL";

const KILOGRAMS_PER_POUND = 0.453592;

export const MEASUREMENT_SYSTEMS = [METRIC, IMPERIAL];

export const UNITS = {
  YEAR: {
    singularName: "year",
    pluralName: "years",
    symbol: "yr",
  },
  CENTIMETER: {
    singularName: "centimeter",
    pluralName: "centimeters",
    symbol: "cm",
    system: METRIC,
  },
  KILOGRAM: {
    singularName: "kilogram",
    pluralName: "kilograms",
    symbol: "kg",
    system: METRIC,
  },
  POUND: {
    singularName: "pound",
    pluralName: "pounds",
    symbol: "lbs",
    system: IMPERIAL,
  },
  GRAM: {
    singularName: "gram",
    pluralName: "grams",
    symbol: "g",
    system: METRIC,
  },
};

export const WEIGHT_UNITS = [UNITS.GRAM, UNITS.KILOGRAM, UNITS.POUND];

export const weightToKilogram = (weight) => {
  const value = (() => {
    switch (weight.unit.symbol) {
      case UNITS.POUND.symbol:
        return weight.value * KILOGRAMS_PER_POUND;
      default:
        return weight.value;
    }
  })();

  return {
    value,
    unit: UNITS.KILOGRAM,
  };
};
