const assert = require("assert");

const assertIsObject = (object) => {
  assert(typeof object === "object");
  assert(object !== null);
};

// returns true if an object is empty and false otherwise
const getObjectIsEmpty = (object) => {
  assertIsObject(object);
  return Object.keys(object).length === 0;
};

module.exports = { getObjectIsEmpty };
