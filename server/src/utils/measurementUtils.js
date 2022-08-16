const METRIC = "METRIC";
const IMPERIAL = "IMPERIAL";

const MEASUREMENT_SYSTEMS = new Set([METRIC, IMPERIAL]);

const UNITS = {
  YEAR: {
    singularName: "year",
    pluralName: "years",
    abbreviation: "yr",
  },
  CENTIMETER: {
    singularName: "centimeter",
    pluralName: "centimeters",
    abbreviation: "cm",
    system: METRIC,
  },
};

const unitExists = (targetUnit) =>
  Object.values(UNITS).some(
    (unit) => JSON.stringify(unit) === JSON.stringify(targetUnit)
  );

module.exports = {
  MEASUREMENT_SYSTEMS,
  UNITS,
  unitExists,
};
