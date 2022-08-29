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
import { removeUserProgressItem } from "../../../redux";
import { CustomSnackbarDispatchContext } from "../../../components/layouts/snackbar/CustomSnackbarDispatchContext";
import { CUSTOM_SNACKBAR_ACTIONS } from "../../../components/layouts/snackbar/CustomSnackbar";

const DeleteProgressPopup = ({ setDeleteProgressPopupIsOpen, progress }) => {
  const { user, progressPage } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { progressType } = progressPage;
  const [isDeletingProgress, setIsDeletingProgress] = useState(false);
  const customSnackbarDispatch = useContext(CustomSnackbarDispatchContext);

  const handleClose = () => setDeleteProgressPopupIsOpen(false);

  const handleDeleteProgress = async (id) => {
    setIsDeletingProgress(true);
    const response = await deleteProgress(user, id);
    customSnackbarDispatch({
      type: CUSTOM_SNACKBAR_ACTIONS.OPEN,
      payload: {
        severity: response.error ? "error" : "success",
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
