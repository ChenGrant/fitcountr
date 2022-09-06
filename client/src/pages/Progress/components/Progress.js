import { IconButton, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingCircle from "../../../components/miscellaneous/LoadingCircle";
import CustomButton from "../../../components/ui/CustomButton";
import { setProgressPageType } from "../../../redux";
import {
  capitalizeOnlyFirstChar,
  getLexSmallest,
  PROGRESS_TYPES,
  PROGRESS_TYPE_NAMES,
  sortArray,
} from "../../../utils";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ProgressPopup from "./ProgressPopup";
import ProgressTable from "./ProgressTable/ProgressTable";
import { getGoalString } from "../utils";
import { ProgressPopupDispatchProvider } from "../context/ProgressPopupDispatchContext";
import useScreenSize from "../../../hooks/useScreenSize";

// ------------------------------ PROGRESS POPUP REDUCER ------------------------------
export const PROGRESS_POPUP_TYPES = {
  ADD_PROGRESS: "ADD_PROGRESS",
  SET_GOAL: "SET_GOAL",
  EDIT_PROGRESS: "EDIT_PROGRESS",
};

const INITIAL_PROGRESS_POPUP_STATE = {
  isOpen: false,
  type: null,
  progressID: null,
};

export const PROGRESS_POPUP_ACTIONS = {
  OPEN: "OPEN",
  CLOSE: "CLOSE",
};

const progressPopupReducer = (state, action) => {
  switch (action.type) {
    case PROGRESS_POPUP_ACTIONS.OPEN:
      return {
        ...state,
        isOpen: true,
        type: action.payload.type,
        progressID: action.payload.progressID ?? null,
      };
    case PROGRESS_POPUP_ACTIONS.CLOSE:
      return { ...INITIAL_PROGRESS_POPUP_STATE };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const Progress = () => {
  const { user, progressPage } = useSelector((state) => state);
  const { desktop, phone } = useScreenSize();
  const { progressType } = progressPage;
  const dispatch = useDispatch();
  const [progressPopup, progressPopupDispatch] = useReducer(
    progressPopupReducer,
    INITIAL_PROGRESS_POPUP_STATE
  );
  const pageIsLoading = progressType === null;

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    if (progressType === null) {
      dispatch(
        setProgressPageType(getLexSmallest(Object.values(PROGRESS_TYPES)))
      );
    }
  }, [progressType, dispatch]);

  // ------------------------------------- RENDER -------------------------------------
  if (pageIsLoading) return <LoadingCircle />;

  return (
    <ProgressPopupDispatchProvider value={progressPopupDispatch}>
      <Box
        p={5}
        display="flex"
        flexDirection="column"
        gap={5}
        alignItems="center"
      >
        {/* Header */}
        <Typography variant="h1">Progress</Typography>
        {/* Progress Tabs */}
        <Tabs
          value={progressType}
          orientation={phone ? "vertical" : "horizontal"}
          onChange={(e, progressType) =>
            dispatch(setProgressPageType(progressType))
          }
        >
          {sortArray(
            Object.values(PROGRESS_TYPES),
            (progressType1, progressType2) =>
              progressType1.localeCompare(progressType2)
          ).map((progressType) => {
            return (
              <Tab
                sx={{
                  textTransform: "none",
                  fontSize: "220px",
                  color: "black",
                }}
                key={progressType}
                value={progressType}
                label={
                  <span style={{ fontSize: "20px" }}>
                    {capitalizeOnlyFirstChar(progressType)}
                  </span>
                }
              />
            );
          })}
        </Tabs>
        <Box
          display="flex"
          alignItems="center"
          flexDirection={desktop ? "row" : "column"}
          gap={desktop ? 25 : 2}
        >
          {/* Goal */}
          <Box display="flex" gap={1} alignItems="center" pl={!desktop && 1.4}>
            <Typography variant="h6">
              {getGoalString(user.goals, progressType)}
            </Typography>
            <IconButton
              onClick={() =>
                progressPopupDispatch({
                  type: PROGRESS_POPUP_ACTIONS.OPEN,
                  payload: {
                    type: PROGRESS_POPUP_TYPES.SET_GOAL,
                  },
                })
              }
            >
              <EditIcon color="primary" />
            </IconButton>
          </Box>
          {/* Add New Progress */}
          <Box>
            <CustomButton
              variant="contained"
              onClick={() =>
                progressPopupDispatch({
                  type: PROGRESS_POPUP_ACTIONS.OPEN,
                  payload: {
                    type: PROGRESS_POPUP_TYPES.ADD_PROGRESS,
                  },
                })
              }
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <AddIcon />
                <Typography variant="h6">
                  New{" "}
                  {capitalizeOnlyFirstChar(
                    PROGRESS_TYPE_NAMES[progressType].singular
                  )}
                </Typography>
              </Box>
            </CustomButton>
          </Box>
        </Box>
        {/* <ProgressTable /> */}
        <ProgressTable />
      </Box>
      {/* Add Progress */}
      {progressPopup.isOpen && (
        <ProgressPopup
          progressPopup={progressPopup}
          closePopup={() =>
            progressPopupDispatch({ type: PROGRESS_POPUP_ACTIONS.CLOSE })
          }
        />
      )}
    </ProgressPopupDispatchProvider>
  );
};

export default Progress;
