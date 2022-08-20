export const METRIC = "METRIC";
export const IMPERIAL = "IMPERIAL";

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
};

export const WEIGHT_UNITS = [UNITS.KILOGRAM, UNITS.POUND];
