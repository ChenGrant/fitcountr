const emailIsValid = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const objectIsEmpty = (object) => Object.keys(object).length === 0;

// generateRandomInteger generates a random integer between min(inclusive)
// and max(exclusive)
const generateRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const numberOfDigits = (integer) => integer.toString().length;

module.exports = {
  emailIsValid,
  objectIsEmpty,
  generateRandomInteger,
  numberOfDigits,
};
