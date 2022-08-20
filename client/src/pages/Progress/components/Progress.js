import { IconButton, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingCircle from "../../../components/miscellaneous/LoadingCircle";
import CustomButton from "../../../components/ui/CustomButton";
import { setProgressPageStat } from "../../../redux";
import {
  capitalizeFirstCharacterLowercaseRest,
  getLexSmallest,
  PROGRESS_TYPES,
  sortArray,
} from "../../../utils";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ProgressTable from "./ProgressTable";
import AddProgressPopup from "./AddProgressPopup";
const Progress = () => {
  const { progressPage } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [addProgressPopupIsOpen, setAddProgressPopupIsOpen] = useState(false);

  const pageIsLoading = progressPage.stat === null;

  useEffect(() => {
    if (progressPage.stat === null) {
      dispatch(
        setProgressPageStat(getLexSmallest(Object.values(PROGRESS_TYPES)))
      );
    }
  }, [progressPage.stat, dispatch]);

  if (pageIsLoading) return <LoadingCircle />;

  return (
    <Box
      p={5}
      display="flex"
      flexDirection="column"
      gap={5}
      alignItems="center"
    >
      <Typography variant="h1">Progress</Typography>
      <Tabs
        value={progressPage.stat}
        onChange={(e, newProgressType) =>
          dispatch(setProgressPageStat(newProgressType))
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
                  {capitalizeFirstCharacterLowercaseRest(progressType)}
                </span>
              }
            />
          );
        })}
      </Tabs>
      <Box display="flex" alignItems="center" gap={25}>
        <Box display="flex" gap={1} alignItems="center">
          <Typography variant="h6">Goal: {45.7} kg</Typography>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Box>
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
                New {capitalizeFirstCharacterLowercaseRest(progressPage.stat)}
              </Typography>
            </Box>
          </CustomButton>
        </Box>
      </Box>
      {/* <ProgressTable /> */}
      <AddProgressPopup
        addProgressPopupIsOpen={addProgressPopupIsOpen}
        setAddProgressPopupIsOpen={setAddProgressPopupIsOpen}
      />
    </Box>
  );
};

export default Progress;
