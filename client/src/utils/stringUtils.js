export const capitalizeFirstCharacter = (string) => {
  if (string === "") return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalizeOnlyFirstChar = (string) => {
  if (string === "") return string;
  return capitalizeFirstCharacter(string.toLowerCase());
};

export const numberWithCommas = (number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
