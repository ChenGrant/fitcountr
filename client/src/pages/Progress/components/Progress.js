import { IconButton, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
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
import AddProgressPopup from "./AddProgressPopup/AddProgressPopup";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const Progress = () => {
  const { progressType } = useSelector((state) => state.progressPage);
  const dispatch = useDispatch();
  const [addProgressPopupIsOpen, setAddProgressPopupIsOpen] = useState(false);
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
      <Box display="flex" alignItems="center" gap={25}>
        {/* Goal */}
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h6">Goal: {45.7} kg</Typography>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Box>
        {/* Add New Progress */}
        <Box>
          <CustomButton
            variant="contained"
            onClick={() => setAddProgressPopupIsOpen(true)}
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
      {addProgressPopupIsOpen && (
        <AddProgressPopup
          setAddProgressPopupIsOpen={setAddProgressPopupIsOpen}
        />
      )}
    </Box>
  );
};

export default Progress;
