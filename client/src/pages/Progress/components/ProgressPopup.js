import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOM_SNACKBAR_ACTIONS } from "../../../components/layouts/snackbar/CustomSnackbar";
import { CustomSnackbarDispatchContext } from "../../../components/layouts/snackbar/CustomSnackbarDispatchContext";
import CustomButton from "../../../components/ui/CustomButton";
import CustomDialog from "../../../components/ui/CustomDialog";
import PostDataButton from "../../../components/ui/PostDataButton";
import useScreenSize from "../../../hooks/useScreenSize";
import {
  addUserProgressItem,
  editUserProgressItem,
  setUserGoals,
} from "../../../redux";
import {
  capitalizeOnlyFirstChar,
  editProgress,
  objectsAreEqual,
  postGoal,
  postProgress,
  PROGRESS_TYPES,
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
const ProgressPopup = ({ progressPopup, closePopup }) => {
  const { user, progressPage } = useSelector((state) => state);
  const { progressType } = progressPage;
  const popupType = progressPopup.type;
  const { desktop, phone } = useScreenSize();
  const customSnackbarDispatch = useContext(CustomSnackbarDispatchContext);
  const dispatch = useDispatch();
  const [isAddingProgress, setIsAddingProgress] = useState(false);
  const [form, formDispatch] = useReducer(formReducer, INITIAL_FORM_STATE);

  const popupIsLoading = objectsAreEqual(form, INITIAL_FORM_STATE);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const handleClose = () => closePopup();

  const getSnackbarActionFromResponse = (response) => {
    const snackbarMessage = (() => {
      switch (popupType) {
        case PROGRESS_POPUP_TYPES.ADD_PROGRESS:
          return response.error
            ? `Could not add new ${PROGRESS_TYPE_NAMES[progressType].singular}`
            : `Added new ${PROGRESS_TYPE_NAMES[progressType].singular}`;
        case PROGRESS_POPUP_TYPES.EDIT_PROGRESS:
          return response.error
            ? `Could not edit ${PROGRESS_TYPE_NAMES[progressType].singular}`
            : `Edited ${PROGRESS_TYPE_NAMES[progressType].singular}`;
        case PROGRESS_POPUP_TYPES.SET_GOAL:
          if (progressType === PROGRESS_TYPES.CALORIES)
            return response.error
              ? "Could not set calorie goal"
              : "Set calorie goal";
          return response.error
            ? `Could not set ${PROGRESS_TYPE_NAMES[progressType].singular} goal`
            : `Set ${PROGRESS_TYPE_NAMES[progressType].singular} goal`;
        default:
          return "";
      }
    })();

    return {
      type: CUSTOM_SNACKBAR_ACTIONS.OPEN,
      payload: {
        severity: response.error ? "error" : "success",
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
            getProgressFromFormValues(values, progressType, user)
          );
        case PROGRESS_POPUP_TYPES.SET_GOAL:
          return await postGoal(
            user,
            getGoalFromFormValues(values, progressType)
          );
        case PROGRESS_POPUP_TYPES.EDIT_PROGRESS:
          return await editProgress(
            user,
            getProgressFromFormValues(values, progressType, user),
            progressPopup.progressID
          );
        default:
          return null;
      }
    })();

    // handle response
    customSnackbarDispatch(getSnackbarActionFromResponse(response));
    if (!response.error) {
      switch (popupType) {
        case PROGRESS_POPUP_TYPES.ADD_PROGRESS:
          dispatch(addUserProgressItem(response, progressType));
          break;
        case PROGRESS_POPUP_TYPES.SET_GOAL:
          dispatch(
            setUserGoals({
              ...user.goals,
              ...getGoalFromFormValues(values, progressType),
            })
          );
          break;
        case PROGRESS_POPUP_TYPES.EDIT_PROGRESS:
          dispatch(
            editUserProgressItem(
              response,
              progressPopup.progressID,
              progressType
            )
          );
          break;
        default:
      }
    }

    handleClose();
  };

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    formDispatch({
      type: FORM_ACTIONS.INITIALIZE,
      payload: {
        initialValues: getInitialValues(progressType, progressPopup, user),
        validationSchema: getValidationSchema(
          progressType,
          progressPopup,
          user
        ),
      },
    });
  }, [progressType, progressPopup, user]);

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
              <Box display="flex" flexDirection="column" gap={2}>
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
                          return progressType === PROGRESS_TYPES.CALORIES
                            ? "Set Calories Goal"
                            : `Set ${capitalizeOnlyFirstChar(
                                PROGRESS_TYPE_NAMES[progressType].singular
                              )} Goal`;
                        case PROGRESS_POPUP_TYPES.EDIT_PROGRESS:
                          return `Edit
                          ${capitalizeOnlyFirstChar(
                            PROGRESS_TYPE_NAMES[progressType].singular
                          )}`;
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
                  gap={2}
                  sx={{ minWidth: desktop && "350px" }}
                >
                  {/* Progress Type */}
                  <ProgressTypeFields popupType={popupType} />
                  {/* Date */}
                  {popupType !== PROGRESS_POPUP_TYPES.SET_GOAL && (
                    <ProgressDateFields />
                  )}
                </Box>
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={phone ? "column-reverse" : "row"}
                  width="100%"
                >
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
