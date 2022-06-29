const emailIsValid = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const objectIsEmpty = (object) => Object.keys(object).length === 0;

module.exports = { emailIsValid, objectIsEmpty };
