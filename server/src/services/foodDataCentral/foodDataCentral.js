const axios = require("axios");
const config = require("../../config/config");

const fetchFoodsFromQueryFoodDataCentral = async ({
  query,
  pageNumber,
  dataType,
  pageSize,
  requireAllWords,
}) => {
  const USDA_API_URL =
    "https://api.nal.usda.gov/fdc/v1/foods/search?" +
    Object.entries({
      api_key: config.FOOD_DATA_CENTRAL_API_KEY,
      query,
      pageNumber,
      dataType,
      pageSize,
      requireAllWords,
    })
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  const fetchedFoods = await axios.get(USDA_API_URL);
  return fetchedFoods;
};

module.exports = { fetchFoodsFromQueryFoodDataCentral };
