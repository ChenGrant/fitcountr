const assert = require("assert");

const assertIsInteger = (integer) => assert(Number.isInteger(integer));

// getRandomIntFromInterval generates a random integer between min(inclusive)
// and max(exclusive)
const getRandomIntFromInterval = (min, max) => {
  assertIsInteger(min);
  assertIsInteger(max);
  assert(max > min);
  return Math.floor(Math.random() * (max - min)) + min;
};

// given an integer, getIntegerLength returns the length of the integer's magnitude.
const getIntMagnitudeLength = (integer) => {
  assertIsInteger(integer);
  return Math.abs(integer).toString().length;
};

module.exports = { getRandomIntFromInterval, getIntMagnitudeLength };
