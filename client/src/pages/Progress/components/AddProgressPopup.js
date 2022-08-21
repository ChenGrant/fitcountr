import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import PostDataButton from "../../../components/ui/PostDataButton";
import {
  capitalizeOnlyFirstChar,
  DATE_FORMAT,
  MIN_WEIGHT,
  objectsAreEqual,
  postProgress,
  PROGRESS_TYPE_NAMES,
  sortArray,
  TIME_FORMAT,
  WEIGHT_UNITS,
} from "../../../utils";
import * as Yup from "yup";
import { TIME_PERIODS } from "../../../utils/dateUtils";
import { getProgressFromFormValues } from "../utils";
import AddProgressPopupDateFields from "./AddProgressPopupDateFields";
import AddProgressPopupWeightFields from "./AddProgressPopupWeightFields";

// ------------------------------------ CONSTANTS ------------------------------------
const UNIT_SELECT_OPTIONS = sortArray(
  WEIGHT_UNITS.map((unit) => ({
    label: `${unit.pluralName} (${unit.symbol})`,
    value: unit.symbol,
  })),
  (option1, option2) => option1.label.localeCompare(option2.label)
);

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const AddProgressPopup = ({
  addProgressPopupIsOpen,
  setAddProgressPopupIsOpen,
}) => {
  const { user } = useSelector((state) => state);
  const { progressType } = useSelector((state) => state.progressPage);
  const [isAddingStat, setIsAddingStat] = useState(false);

  const initialValues = {
    [progressType]: "",
    unit: UNIT_SELECT_OPTIONS?.[0].value ?? "",
    currentTimeIsUsed: true,
    date: "",
    time: "",
  };

  const validationSchema = Yup.object({
    [progressType]: Yup.number()
      .required("Required")
      .typeError("Height must be a number")
      .test(
        "minWeight",
        `Weight must be greater than ${MIN_WEIGHT.value} ${MIN_WEIGHT.unit.symbol}`,
        (weight) => weight > MIN_WEIGHT.value
      ),
    unit: Yup.string()
      .trim()
      .required("Required")
      .oneOf(UNIT_SELECT_OPTIONS.map(({ value }) => value)),
    date: Yup.string().when("currentTimeIsUsed", {
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
    }),

    time: Yup.string().when("currentTimeIsUsed", {
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
                !isNaN(hour) && !isNaN(minute) && TIME_PERIODS.includes(period)
              );
            } catch (err) {
              return false;
            }
          }
        )
        .test("validTimeString", "Invalid time", (time) =>
          moment(time, TIME_FORMAT, true).isValid()
        ),
    }),
  });

  // ----------------------------------- FUNCTIONS -----------------------------------
  const resetState = () => setIsAddingStat(false);

  const handleClose = () => setAddProgressPopupIsOpen(false);

  const addStat = async (values) => {
    const response = await postProgress(
      user,
      getProgressFromFormValues(values, progressType)
    );
    console.log(response);
    // render snackbar confirmation for success/error
  };

  const onSubmit = async (values) => {
    setIsAddingStat(true);
    await addStat(values);
    handleClose();
  };

  // ------------------------------------- RENDER -------------------------------------
  return (
    <CustomDialog
      open={addProgressPopupIsOpen}
      onClose={handleClose}
      onExited={resetState}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <Box display="flex" flexDirection="column" gap={6}>
                {/* Header */}
                <Box>
                  <Typography variant="h4" gutterBottom>
                    Add New{" "}
                    {capitalizeOnlyFirstChar(
                      PROGRESS_TYPE_NAMES[progressType].singular
                    )}
                  </Typography>
                </Box>
                {/* Form Fields */}
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={4}
                  sx={{ minWidth: "350px" }}
                >
                  {/* Progress Type */}
                  <AddProgressPopupWeightFields
                    UNIT_SELECT_OPTIONS={UNIT_SELECT_OPTIONS}
                  />
                  {/* Date */}
                  <AddProgressPopupDateFields />
                </Box>
                {/* Buttons */}
                <Box display="flex" gap={2} width="100%">
                  <Box flex={1}>
                    <CustomButton
                      variant="outlined"
                      sx={{ textTransform: "none", width: "100%" }}
                      onClick={handleClose}
                    >
                      Back
                    </CustomButton>
                  </Box>

                  <Box flex={1}>
                    <PostDataButton
                      isPostingData={isAddingStat}
                      type="submit"
                      variant="contained"
                      sx={{ width: "100%" }}
                      disabled={
                        !formik.isValid ||
                        objectsAreEqual(initialValues, formik.values)
                      }
                    >
                      Confirm
                    </PostDataButton>
                  </Box>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </CustomDialog>
  );
};

export default AddProgressPopup;
