const assert = require("assert");

const assertIsString = (string) =>
  assert(typeof string === "string" || string instanceof String);

const getStringIsEmpty = (string) => {
  assertIsString(string);
  return string === "";
};

const getStringIsValidEmail = (string) => {
  assertIsString(string);
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(string);
};

module.exports = { getStringIsValidEmail, getStringIsEmpty };
