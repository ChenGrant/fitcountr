import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../../../components/ui/CustomButton";
import CustomDialog from "../../../../components/ui/CustomDialog";
import PostDataButton from "../../../../components/ui/PostDataButton";
import {
  capitalizeOnlyFirstChar,
  objectsAreEqual,
  postProgress,
  PROGRESS_TYPES,
  PROGRESS_TYPE_NAMES,
} from "../../../../utils";
import {
  getInitialValuesFromProgressType,
  getProgressFromFormValues,
  getValidationSchemaFromProgressType,
} from "../../utils";
import AddProgressPopupDateFields from "./AddProgressPopupDateFields";
import WeightFields from "../WeightFields";

// ----------------------------------- FORM REDUCER -----------------------------------
const FORM_ACTIONS = {
  INITIALIZE: "INITIALIZE",
};

const INITIAL_FORM_STATE = {
  initialValues: null,
  validationSchema: null,
};

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM_ACTIONS.INITIALIZE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const AddProgressPopup = ({ setAddProgressPopupIsOpen }) => {
  const { user } = useSelector((state) => state);
  const { progressType } = useSelector((state) => state.progressPage);
  const [isAddingStat, setIsAddingStat] = useState(false);
  const [form, formDispatch] = useReducer(formReducer, INITIAL_FORM_STATE);
  const popupIsLoading = objectsAreEqual(form, INITIAL_FORM_STATE);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const renderProgressFields = (progressType) => {
    switch (progressType) {
      case PROGRESS_TYPES.WEIGHTS:
        return <WeightFields />;
      default:
        return null;
    }
  };

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

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    formDispatch({
      type: FORM_ACTIONS.INITIALIZE,
      payload: {
        initialValues: getInitialValuesFromProgressType(progressType),
        validationSchema: getValidationSchemaFromProgressType(progressType),
      },
    });
  }, [progressType]);

  // ------------------------------------- RENDER -------------------------------------
  if (popupIsLoading) return null;

  return (
    <CustomDialog open onClose={handleClose}>
      <Formik
        enableReinitialize
        initialValues={form.initialValues}
        validationSchema={form.validationSchema}
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
                  {renderProgressFields(progressType)}
                  {/* Date */}
                  <AddProgressPopupDateFields />
                </Box>
                <Box display="flex" gap={2} width="100%">
                  {/* Back Button */}
                  <Box flex={1}>
                    <CustomButton
                      variant="outlined"
                      sx={{ textTransform: "none", width: "100%" }}
                      onClick={handleClose}
                    >
                      Back
                    </CustomButton>
                  </Box>
                  {/* Confirm Button */}
                  <Box flex={1}>
                    <PostDataButton
                      isPostingData={isAddingStat}
                      type="submit"
                      variant="contained"
                      sx={{ width: "100%" }}
                      disabled={
                        !formik.isValid ||
                        objectsAreEqual(form.initialValues, formik.values)
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
