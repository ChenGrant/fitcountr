export const sortArray = (array, comparator) => {
  const arrayCopy = [...array];
  arrayCopy.sort(comparator);
  return arrayCopy;
};

export const getLexSmallest = (array) =>
  array.reduce((prev, curr) => (prev.localeCompare(curr) < 0 ? prev : curr));
