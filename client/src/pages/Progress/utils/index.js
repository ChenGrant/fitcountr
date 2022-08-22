import moment from "moment";
import {
  DATE_FORMAT,
  MIN_STEPS,
  MIN_WEIGHT,
  PROGRESS_TYPES,
  PROGRESS_TYPE_NAMES,
  TIME_FORMAT,
  UNITS,
} from "../../../utils";
import * as Yup from "yup";
import { TIME_PERIODS } from "../../../utils/dateUtils";
import { UNIT_SELECT_OPTIONS } from "../components/ProgressTypeFields/WeightFields";
import { PROGRESS_POPUP_TYPES } from "../components/Progress";

export const getProgressFromFormValues = (formValues, progressType) => {
  const progress = {
    date: formValues.currentTimeIsUsed
      ? new Date()
      : moment(
          `${formValues.date} ${formValues.time}`,
          `${DATE_FORMAT} ${TIME_FORMAT}`
        ).toDate(),
  };

  const singularProgressType = PROGRESS_TYPE_NAMES[progressType].singular;

  switch (progressType) {
    case PROGRESS_TYPES.WEIGHTS:
      progress[singularProgressType] = {
        value: formValues[singularProgressType],
        unit: Object.values(UNITS).filter(
          ({ symbol }) => symbol === formValues.unit
        )[0],
      };
      break;

    default:
      progress[singularProgressType] = formValues[singularProgressType];
  }

  return progress;
};

export const getGoalFromFormValues = (formValues, progressType) => {
  const goal = {};
  const singularProgressType = PROGRESS_TYPE_NAMES[progressType].singular;
  switch (progressType) {
    case PROGRESS_TYPES.WEIGHTS:
      goal[singularProgressType] = {
        value: formValues[singularProgressType],
        unit: Object.values(UNITS).filter(
          ({ symbol }) => symbol === formValues.unit
        )[0],
      };
      break;
    default:
      goal[singularProgressType] = formValues[singularProgressType];
  }
  return goal;
};

export const getInitialValues = (progressType, popupType) => {
  const initialValues = {};

  switch (popupType) {
    case PROGRESS_POPUP_TYPES.ADD_PROGRESS:
      initialValues.currentTimeIsUsed = true;
      initialValues.date = "";
      initialValues.time = "";
      break;
    default:
  }

  const singularProgressType = PROGRESS_TYPE_NAMES[progressType].singular;
  switch (progressType) {
    case PROGRESS_TYPES.WEIGHTS:
      initialValues[singularProgressType] = "";
      initialValues.unit = UNIT_SELECT_OPTIONS?.[0].value ?? "";
      break;
    case PROGRESS_TYPES.STEPS:
      initialValues[singularProgressType] = "";
      break;
    default:
  }

  return initialValues;
};

export const getValidationSchema = (progressType, popupType) => {
  const validationSchemaObject = {};

  switch (popupType) {
    case PROGRESS_POPUP_TYPES.ADD_PROGRESS:
      validationSchemaObject.date = Yup.string().when("currentTimeIsUsed", {
        is: false,
        then: Yup.string()
          .trim()
          .required("Required")
          .test(
            "validDateFormat",
            `Date must be in the form ${DATE_FORMAT}`,
            (birthday) => {
              try {
                if (birthday.length !== DATE_FORMAT.length) return false;
                if (birthday.charAt(2) !== "/" || birthday.charAt(5) !== "/")
                  return false;
                const day = birthday.substring(0, 2);
                const month = birthday.substring(3, 5);
                const year = birthday.substring(6);
                return !isNaN(day) && !isNaN(month) && !isNaN(year);
              } catch (err) {
                return false;
              }
            }
          )
          .test("validDateString", "Invalid date", (birthday) =>
            moment(birthday, DATE_FORMAT, true).isValid()
          )
          .test(
            "dateHasPassed",
            "Date must be in the past",
            (birthday) => moment(birthday, DATE_FORMAT).toDate() <= new Date()
          ),
      });
      validationSchemaObject.time = Yup.string().when("currentTimeIsUsed", {
        is: false,
        then: Yup.string()
          .required("Required")
          .trim()
          .test(
            "validDateFormat",
            `Time must be in the form ${TIME_FORMAT}`,
            (time) => {
              try {
                if (time.charAt(2) !== ":" || time.charAt(5) !== " ")
                  return false;
                const hour = time.substring(0, 2);
                const minute = time.substring(3, 5);
                const period = time.substring(6).toUpperCase();
                return (
                  !isNaN(hour) &&
                  !isNaN(minute) &&
                  TIME_PERIODS.includes(period)
                );
              } catch (err) {
                return false;
              }
            }
          )
          .test("validTimeString", "Invalid time", (time) =>
            moment(time, TIME_FORMAT, true).isValid()
          ),
      });
      break;
    default:
  }

  const singularProgressType = PROGRESS_TYPE_NAMES[progressType].singular;
  switch (progressType) {
    case PROGRESS_TYPES.WEIGHTS:
      validationSchemaObject[singularProgressType] = Yup.number()
        .required("Required")
        .typeError("Height must be a number")
        .test(
          "minWeight",
          `Weight must be greater than ${MIN_WEIGHT.value} ${MIN_WEIGHT.unit.symbol}`,
          (weight) => weight > MIN_WEIGHT.value
        );
      validationSchemaObject["unit"] = Yup.string()
        .trim()
        .required("Required")
        .oneOf(UNIT_SELECT_OPTIONS.map(({ value }) => value));
      break;

    case PROGRESS_TYPES.STEPS:
      validationSchemaObject[singularProgressType] = Yup.number()
        .required("Required")
        .typeError("Steps must be a number")
        .test("isInteger", "Steps must be an integer", (steps) =>
          Number.isInteger(steps)
        )
        .test(
          "minSteps",
          `Steps must be greater than or equal to ${MIN_STEPS}`,
          (steps) => steps >= MIN_STEPS
        );
      break;

    default:
  }

  return Yup.object(validationSchemaObject);
};

export const getGoalString = (goal, progressType) => {
  console.log(goal)
  //const singularProgressType = PROGRESS_TYPE_NAMES[progressType].singular;
  switch (progressType.toUpperCase()) {
    case PROGRESS_TYPES.WEIGHTS:
      return "weights";
    case PROGRESS_TYPES.STEPS:
      return "steps";
    default:
      return "";
  }
};
