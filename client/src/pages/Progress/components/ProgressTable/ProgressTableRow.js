import { Box, IconButton, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteProgressPopup from "../DeleteProgressPopup";
import { ProgressPopupDispatchContext } from "../../context/ProgressPopupDispatchContext";
import { PROGRESS_POPUP_ACTIONS, PROGRESS_POPUP_TYPES } from "../Progress";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const ProgressTableRow = ({ row, columnHeaders }) => {
  const [deleteProgressPopupIsOpen, setDeleteProgressPopupIsOpen] =
    useState(false);
  const progressPopupDispatch = useContext(ProgressPopupDispatchContext);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      width="max-content"
      borderTop="1px solid #D3D3D3"
      py={0.2}
      px={1}
      sx={{ "&:hover": { bgcolor: "#ededed" } }}
    >
      {columnHeaders?.map(({ label, width }) => (
        <Box width={width} key={label}>
          <Typography>{row[label]}</Typography>
        </Box>
      ))}
      {/* Edit Icon */}
      <IconButton
        sx={{ "&:hover": { color: "primary.main" } }}
        onClick={() =>
          progressPopupDispatch({
            type: PROGRESS_POPUP_ACTIONS.OPEN,
            payload: {
              type: PROGRESS_POPUP_TYPES.EDIT_PROGRESS,
              progressID: row.id,
            },
          })
        }
      >
        <EditIcon />
      </IconButton>
      {/* Delete Icon */}
      <IconButton
        sx={{ "&:hover": { color: "#cc0000" } }}
        onClick={() => setDeleteProgressPopupIsOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      {deleteProgressPopupIsOpen && (
        <DeleteProgressPopup
          setDeleteProgressPopupIsOpen={setDeleteProgressPopupIsOpen}
          progress={row}
        />
      )}
    </Box>
  );
};

export default ProgressTableRow;
