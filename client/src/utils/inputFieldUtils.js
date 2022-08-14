export const FORM_ERROR_HEIGHT = "24px";

export const EMAIL_ALREADY_IN_USE = "Email already in use";

// given a the name attribute of an input field, fieldName, and the
// formik object, errorIsRendered returns true if there is an error
// being rendered for the input field with a name attribute of fieldName
// and false otherwise
export const errorIsRendered = (fieldName, formik) =>
  formik.errors[fieldName] && formik.touched[fieldName];
