import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import { SNACKBAR_ACTIONS } from "../../../components/ui/CustomSnackbar";
import PostDataButton from "../../../components/ui/PostDataButton";
import {
  capitalizeOnlyFirstChar,
  objectsAreEqual,
  postGoal,
  postProgress,
  PROGRESS_TYPE_NAMES,
} from "../../../utils";
import {
  getGoalFromFormValues,
  getInitialValues,
  getProgressFromFormValues,
  getValidationSchema,
} from "../utils";
import { PROGRESS_POPUP_TYPES } from "./Progress";
import ProgressDateFields from "./ProgressDateFields";
import ProgressTypeFields from "./ProgressTypeFields/ProgressTypeFields";

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
const ProgressPopup = ({ popupType, closePopup, snackbarDispatch }) => {
  const { user } = useSelector((state) => state);
  const { progressType } = useSelector((state) => state.progressPage);
  const [isAddingProgress, setIsAddingProgress] = useState(false);
  const [form, formDispatch] = useReducer(formReducer, INITIAL_FORM_STATE);

  const popupIsLoading = objectsAreEqual(form, INITIAL_FORM_STATE);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleClose = () => closePopup();

  const getSnackbarActionFromResponse = (response) => {
    const snackbarType = response.error
      ? SNACKBAR_ACTIONS.FAILURE
      : SNACKBAR_ACTIONS.SUCCESS;

    const snackbarMessage = (() => {
      switch (popupType) {
        case PROGRESS_POPUP_TYPES.ADD_PROGRESS:
          return response.error
            ? `Could not add new ${PROGRESS_TYPE_NAMES[progressType].singular}`
            : `Added new ${PROGRESS_TYPE_NAMES[progressType].singular}`;
        case PROGRESS_POPUP_TYPES.SET_GOAL:
          return response.error
            ? `Could not set ${PROGRESS_TYPE_NAMES[progressType].singular} goal`
            : `Set ${PROGRESS_TYPE_NAMES[progressType].singular} goal`;
        default:
          return "";
      }
    })();

    return {
      type: snackbarType,
      payload: {
        message: snackbarMessage,
      },
    };
  };

  const onSubmit = async (values) => {
    setIsAddingProgress(true);

    // send request
    const response = await (async () => {
      switch (popupType) {
        case PROGRESS_POPUP_TYPES.ADD_PROGRESS:
          return await postProgress(
            user,
            getProgressFromFormValues(values, progressType)
          );
        case PROGRESS_POPUP_TYPES.SET_GOAL:
          return await postGoal(
            user,
            getGoalFromFormValues(values, progressType)
          );
        default:
          return null;
      }
    })();

    // handle response
    snackbarDispatch(getSnackbarActionFromResponse(response));

    handleClose();
  };

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    formDispatch({
      type: FORM_ACTIONS.INITIALIZE,
      payload: {
        initialValues: getInitialValues(progressType, popupType),
        validationSchema: getValidationSchema(progressType, popupType),
      },
    });
  }, [progressType, popupType]);

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
                    {(() => {
                      switch (popupType) {
                        case PROGRESS_POPUP_TYPES.ADD_PROGRESS:
                          return `Add New
                          ${capitalizeOnlyFirstChar(
                            PROGRESS_TYPE_NAMES[progressType].singular
                          )}`;
                        case PROGRESS_POPUP_TYPES.SET_GOAL:
                          return `Set ${capitalizeOnlyFirstChar(
                            PROGRESS_TYPE_NAMES[progressType].singular
                          )} Goal`;
                        default:
                          return null;
                      }
                    })()}
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
                  <ProgressTypeFields />
                  {/* Date */}
                  {popupType !== PROGRESS_POPUP_TYPES.SET_GOAL && (
                    <ProgressDateFields />
                  )}
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
                      isPostingData={isAddingProgress}
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

export default ProgressPopup;
