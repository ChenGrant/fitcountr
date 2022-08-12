export const sortArray = (array, comparator) => {
  const arrayCopy = [...array];
  arrayCopy.sort(comparator);
  return arrayCopy;
};
