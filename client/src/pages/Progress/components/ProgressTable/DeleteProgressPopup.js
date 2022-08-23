import React, { useState } from "react";
import CustomDialog from "../../../../components/ui/CustomDialog";
import CustomButton from "../../../../components/ui/CustomButton";
import PostDataButton from "../../../../components/ui/PostDataButton";
import { useSelector } from "react-redux";
import {
  capitalizeOnlyFirstChar,
  PROGRESS_TYPE_NAMES,
} from "../../../../utils";
import { Box, Typography } from "@mui/material";

const DeleteProgressPopup = ({ setDeleteProgressPopupIsOpen, progress }) => {
  const { progressType } = useSelector((state) => state.progressPage);
  const [isDeletingProgress, setIsDeletingProgress] = useState(false);

  const handleClose = () => setDeleteProgressPopupIsOpen(false);

  const handleDeleteProgress = async (id) => {
    setIsDeletingProgress(true);
    console.log(id);
    await new Promise((r) => setTimeout(r, 2000));
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
