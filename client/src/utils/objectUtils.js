export const objectIsEmpty = (object) => Object.keys(object).length === 0;

export const objectsAreEqual = (object1, object2) =>
  JSON.stringify(object1) === JSON.stringify(object2);
