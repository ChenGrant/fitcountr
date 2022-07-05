// generateRandomInteger generates a random integer between min(inclusive)
// and max(exclusive)
const generateRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

// given an integer, getIntegerLength returns the length of the integer.
const getIntegerLength = (integer) => Math.abs(integer).toString().length;

module.exports = { generateRandomInteger, getIntegerLength };
