const axios = require("axios");

const fetchFoodFromBarcodeNumberOpenFoodFacts = async (barcodeNumber) => {
  const fetchedFood = await axios.get(
    `https://world.openfoodfacts.org/api/v0/product/${barcodeNumber}.json`
  );
  if (fetchedFood.data.status === 0) throw new Error("No code or invalid code");
  return fetchedFood;
};

module.exports = {
  fetchFoodFromBarcodeNumberOpenFoodFacts,
};
