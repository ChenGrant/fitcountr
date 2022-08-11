const assert = require("assert");

const assertIsString = (string) =>
  assert(typeof string === "string" || string instanceof String);

const getStringIsEmpty = (string) => {
  assertIsString(string);
  return string === "";
};

module.exports = { getStringIsEmpty };
