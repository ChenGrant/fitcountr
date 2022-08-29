const PROGRESS_TYPES = {
  WEIGHT: "WEIGHT",
  STEPS: "STEPS",
  MEAL: 'MEAL'
};

const hasExactlyOneProgressType = (doc) =>
  Object.keys(doc).filter((key) => PROGRESS_TYPES[key.toUpperCase()]).length ===
  1;

module.exports = {
  PROGRESS_TYPES,
  hasExactlyOneProgressType,
};
