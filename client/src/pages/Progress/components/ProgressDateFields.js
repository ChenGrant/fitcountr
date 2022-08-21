import { Box } from "@mui/material";
import { FormikContext, useFormikContext } from "formik";
import React from "react";
import FormikControl from "../../../components/formik/FormikControl";
import { DATE_FORMAT, TIME_FORMAT } from "../../../utils";

const ProgressDateFields = () => {
  const formik = useFormikContext(FormikContext);
  const { currentTimeIsUsed } = formik.values;

  return (
    <Box display="flex" flexDirection="column" gap={1} textAlign="left">
      <FormikControl
        control="checkbox"
        label="Use current time"
        name="currentTimeIsUsed"
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
  );
};

export default ProgressDateFields;
