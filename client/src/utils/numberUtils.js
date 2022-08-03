export const sub = (a, b) => {
  const a1 = a.toString().split(".");
  const a1_max = a1.length === 2 ? a1[1].length : 0;

  const b1 = b.toString().split(".");
  const b1_max = b1.length === 2 ? b1[1].length : 0;

  return Number((a - b).toFixed(a1_max > b1_max ? a1_max : b1_max));
};

export const round = (number, decimalPlaces) =>
  Math.round((number + Number.EPSILON) * Math.pow(10, decimalPlaces)) /
  Math.pow(10, decimalPlaces);
