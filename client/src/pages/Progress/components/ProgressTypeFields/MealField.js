import React from "react";
import { useSelector } from "react-redux";
import FormikControl from "../../../../components/formik/FormikControl";
import {
  capitalizeOnlyFirstChar,
  PROGRESS_TYPE_NAMES,
  sortArray,
  UNITS,
  WEIGHT_UNITS,
} from "../../../../utils";

export const FOOD_UNIT_SELECT_OPTIONS = sortArray(
  WEIGHT_UNITS.map((unit) => ({
    label: `${unit.pluralName} (${unit.symbol})`,
    value: unit.symbol,
  })).filter(({ value }) => [UNITS.GRAM.symbol].includes(value)),
  (option1, option2) => option1.label.localeCompare(option2.label)
);

const MealField = () => {
  const { user } = useSelector((state) => state);
  const { progressType } = useSelector((state) => state.progressPage);

  return (
    <>
      <FormikControl
        control="select"
        label={capitalizeOnlyFirstChar(
          PROGRESS_TYPE_NAMES[progressType].singular
        )}
        name={PROGRESS_TYPE_NAMES[progressType].singular}
        options={sortArray(
          Object.entries(user.foods).map(([id, food]) => ({
            label: capitalizeOnlyFirstChar(food.name),
            value: id,
          })),
          (food1, food2) => food1.label.localeCompare(food2.label)
        )}
      />
      <FormikControl
        control="input"
        type="number"
        label="Weight"
        name="weight"
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      />
      <FormikControl
        control="select"
        label="Unit"
        name="unit"
        options={FOOD_UNIT_SELECT_OPTIONS}
      />
    </>
  );
};

export default MealField;
