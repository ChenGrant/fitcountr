import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import FormikControl from "../../../components/formik/FormikControl";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import {
  DATE_FORMAT,
  sortArray,
  TIME_FORMAT,
  WEIGHT_UNITS,
} from "../../../utils";

// const UNIT_SELECT_OPTIONS = sortArray(WEIGHT_UNITS, (unit1, unit2) =>
//   unit1.abbreviation.localeCompare(unit2.abbreviation)
// );

const UNIT_SELECT_OPTIONS = sortArray(
  WEIGHT_UNITS.map((unit) => ({
    label: `${unit.pluralName} (${unit.symbol})`,
    value: unit.symbol,
  })),
  (option1, option2) => option1.label.localeCompare(option2.label)
);

const AddProgressPopup = ({
  addProgressPopupIsOpen,
  setAddProgressPopupIsOpen,
}) => {
  const { progressPage } = useSelector((state) => state);
  const [currentTimeIsUsed, setCurrentTimeIsUsed] = useState(true);
  const initialValues = {
    [progressPage.stat]: "",
    unit: UNIT_SELECT_OPTIONS?.[0].value ?? "",
    date: currentTimeIsUsed ? moment(new Date()).format(DATE_FORMAT) : "",
    time: currentTimeIsUsed ? moment(new Date()).format(TIME_FORMAT) : "",
  };

  const resetState = () => {
    setCurrentTimeIsUsed(true);
  };

  const handleClose = () => {
    setAddProgressPopupIsOpen(false);
  };

  const onSubmit = (values) => console.log(values);

  return (
    <CustomDialog
      open={addProgressPopupIsOpen}
      onClose={handleClose}
      onExited={resetState}
    >
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Box display="flex" flexDirection="column" gap={6}>
            {/* Header */}
            <Box>
              <Typography variant="h4" gutterBottom>
                Add New Weight
              </Typography>
            </Box>
            {/* Form Fields */}
            <Box>
              <Box display="flex" gap="24px">
                <Box flex={1}>
                  <FormikControl
                    control="input"
                    type="number"
                    label={progressPage.stat}
                    name={progressPage.stat}
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  />
                </Box>
                <Box flex={1} width="200px" textAlign="left">
                  <FormikControl
                    control="select"
                    label="Unit"
                    name="unit"
                    options={UNIT_SELECT_OPTIONS}
                  />
                </Box>
              </Box>
              <FormControlLabel
                sx={{ width: "100%" }}
                control={
                  <Checkbox
                    checked={currentTimeIsUsed}
                    onChange={(e) => setCurrentTimeIsUsed(e.target.checked)}
                  />
                }
                label={<Typography>Use current time</Typography>}
              />
              <FormikControl
                disabled={currentTimeIsUsed}
                control="input"
                label={`Date (${DATE_FORMAT})`}
                name="date"
                sx={{ bgcolor: currentTimeIsUsed && "rgba(0,0,0,0.1)" }}
              />
              <FormikControl
                disabled={currentTimeIsUsed}
                control="input"
                label={`Time (${TIME_FORMAT})`}
                name="time"
                sx={{ bgcolor: currentTimeIsUsed && "rgba(0,0,0,0.1)" }}
              />
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
                <CustomButton
                  variant="contained"
                  sx={{ width: "100%" }}
                  type="submit"
                >
                  Confirm
                </CustomButton>
              </Box>
            </Box>
          </Box>
        </Form>
      </Formik>
    </CustomDialog>
  );
};

export default AddProgressPopup;
