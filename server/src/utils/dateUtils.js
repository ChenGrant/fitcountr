const addDays = (dateObject, additionalDays) =>
  new Date(dateObject.setDate(dateObject.getDate() + additionalDays));

module.exports = {
  addDays,
};
