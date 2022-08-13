import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingCircle from "../../../components/miscellaneous/LoadingCircle";
import { setProgressPageStat } from "../../../redux";
import { getLexSmallest, PROGRESS_TYPES } from "../../../utils";

const Progress = () => {
  const { progressPage } = useSelector((state) => state);
  const dispatch = useDispatch();

  const pageIsLoading = progressPage === null;

  useEffect(() => {
    if (progressPage.stat === null) {
      dispatch(
        setProgressPageStat(getLexSmallest(Object.values(PROGRESS_TYPES)))
      );
    }
  }, [progressPage.stat, dispatch]);

  if (pageIsLoading) return <LoadingCircle />;

  return (
    <Box>
      <Typography>Progress</Typography>
      <Typography>{progressPage.stat}</Typography>
    </Box>
  );
};

export default Progress;
