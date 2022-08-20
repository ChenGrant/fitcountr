import moment from "moment";
import {
  DATE_FORMAT,
  PROGRESS_TYPES,
  TIME_FORMAT,
  UNITS,
} from "../../../utils";

export const getProgressFromFormValues = (formValues, progressStat) => ({
  [progressStat.toLowerCase()]:
    progressStat === PROGRESS_TYPES.WEIGHT
      ? {
          value: formValues[progressStat],
          unit: Object.values(UNITS).filter(
            ({ symbol }) => symbol === formValues.unit
          )[0],
        }
      : {},
  date: formValues.currentTimeIsUsed
    ? new Date()
    : moment(
        `${formValues.date} ${formValues.time}`,
        `${DATE_FORMAT} ${TIME_FORMAT}`
      ).toDate(),
});
