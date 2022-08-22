import { DATE_FORMAT, UNITS } from "../../../utils";
import moment from "moment";

export const getFormValuesFromProfile = (user) => {
  const formValues = {
    profilePicture: {
      URL: user.profilePicture.URL,
      file: null,
    },
    sex: "",
    height: "",
    birthday: "",
  };

  Object.entries(user.profile).forEach(([key, value]) => {
    switch (key) {
      case "birthday":
        formValues[key] = moment(value).format(DATE_FORMAT);
        break;
      case "height":
        formValues[key] = value.value;
        break;
      default:
        formValues[key] = value;
    }
  });

  return formValues;
};

export const getProfileDataFromFormValues = (formValues, initialFormValues) =>
  Object.fromEntries(
    Object.entries(formValues)
      .filter(([key, value]) => {
        switch (key) {
          case "profilePicture":
            return value.file && value.URL !== initialFormValues[key].URL;
          default:
            return value !== initialFormValues[key];
        }
      })
      .map(([key, value]) => {
        const formattedValue = (() => {
          switch (key) {
            case "profilePicture":
              return value.file;

            case "height":
              return value === "" ? null : { value, unit: UNITS.CENTIMETER };

            case "birthday":
              return moment(value, DATE_FORMAT).toDate();

            default:
              return value;
          }
        })();
        return [key, formattedValue];
      })
  );
