const assert = require("assert");

const assertIsArray = (array) => assert(Array.isArray(array));

// returns true if an array is empty and false otherwise
const getArrayIsEmpty = (array) => {
  assertIsArray(array);
  return array.length === 0;
};

module.exports = { getArrayIsEmpty };
