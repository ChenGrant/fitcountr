import React, { useContext, useState } from "react";
import CustomDialog from "../../../components/ui/CustomDialog";
import CustomButton from "../../../components/ui/CustomButton";
import PostDataButton from "../../../components/ui/PostDataButton";
import { useDispatch, useSelector } from "react-redux";
import {
  capitalizeOnlyFirstChar,
  deleteProgress,
  PROGRESS_TYPE_NAMES,
} from "../../../utils";
import { Box, Typography } from "@mui/material";
import { SnackbarDispatchContext } from "../context/SnackbarDispatchContext";
import { SNACKBAR_ACTIONS } from "../../../components/ui/CustomSnackbar";
import { removeUserProgressItem } from "../../../redux";

const DeleteProgressPopup = ({ setDeleteProgressPopupIsOpen, progress }) => {
  const { user, progressPage } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { progressType } = progressPage;
  const [isDeletingProgress, setIsDeletingProgress] = useState(false);
  const snackbarDispatch = useContext(SnackbarDispatchContext);

  const handleClose = () => setDeleteProgressPopupIsOpen(false);

  const handleDeleteProgress = async (id) => {
    setIsDeletingProgress(true);
    const response = await deleteProgress(user, id);
    snackbarDispatch({
      type: response.error
        ? SNACKBAR_ACTIONS.FAILURE
        : SNACKBAR_ACTIONS.SUCCESS,
      payload: {
        message: response.error
          ? `Could not delete ${PROGRESS_TYPE_NAMES[progressType].singular} progress`
          : `${capitalizeOnlyFirstChar(
              PROGRESS_TYPE_NAMES[progressType].singular
            )} progress deleted`,
      },
    });
    dispatch(removeUserProgressItem(id, progressType));
    handleClose();
  };

  return (
    <CustomDialog open onClose={handleClose}>
      <Typography variant="h4" gutterBottom>
        Delete{" "}
        {capitalizeOnlyFirstChar(PROGRESS_TYPE_NAMES[progressType].singular)}?
      </Typography>
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
        <Box width="135px">
          <PostDataButton
            isPostingData={isDeletingProgress}
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => handleDeleteProgress(progress.id)}
          >
            Confirm
          </PostDataButton>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default DeleteProgressPopup;
