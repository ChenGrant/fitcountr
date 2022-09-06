import {
  getNutrientFromFood,
  round,
  sortArray,
  UNITS,
  weightToKilogram,
} from "../../../utils";

const DECIMAL_PRECISION = 2;

const START_OF_TODAY = new Date(new Date().toDateString());

const getTodaysWeight = (user) => {
  const todayWeight = user.progress?.weight?.filter(
    ({ date }) => new Date(date) > START_OF_TODAY
  )?.[0]?.weight ?? {
    value: 0,
    unit: UNITS.KILOGRAM,
  };

  const todayWeightInKilogram = weightToKilogram(todayWeight);

  return {
    progressType: "weight",
    progressValue: `${round(todayWeightInKilogram.value, DECIMAL_PRECISION)} ${
      todayWeightInKilogram.unit.symbol
    }`,
    goalDiff: !user.goals.weight
      ? null
      : `${round(
          todayWeightInKilogram.value -
            weightToKilogram(user.goals.weight).value,
          DECIMAL_PRECISION
        )} ${todayWeightInKilogram.unit.symbol}`,
  };
};

const getTodaysSteps = (user) => {
  const todaysSteps =
    user.progress?.steps
      ?.filter(({ date }) => new Date(date) > START_OF_TODAY)
      ?.reduce((prev, curr) => prev + curr.steps, 0) ?? 0;

  return {
    progressType: "steps",
    progressValue: round(todaysSteps, DECIMAL_PRECISION),
    goalDiff: !user.goals.steps
      ? null
      : round(todaysSteps - user.goals.steps, DECIMAL_PRECISION),
  };
};

const getTodaysCalories = (user) => {
  const todaysCalories =
    user?.progress?.food
      ?.filter(({ date }) => new Date(date) > START_OF_TODAY)
      ?.reduce(
        (prev, curr) => prev + getNutrientFromFood(curr.food, "calories"),
        0
      ) ?? 0;

  return {
    progressType: "calories",
    progressValue: round(todaysCalories, DECIMAL_PRECISION),
    goalDiff: !user.goals.calories
      ? null
      : round(todaysCalories - user.goals.calories, DECIMAL_PRECISION),
  };
};

export const getDailyProgress = (user) =>
  sortArray(["calories", "weight", "steps"], (progressType1, progressType2) =>
    progressType1.localeCompare(progressType2)
  ).map((goal) => {
    switch (goal) {
      case "calories":
        return getTodaysCalories(user);
      case "weight":
        return getTodaysWeight(user);
      case "steps":
        return getTodaysSteps(user);
      default:
        return {};
    }
  });
