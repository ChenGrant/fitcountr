import { Box, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteProgressPopup from "./DeleteProgressPopup";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const ProgressTableRow = ({ row, columnHeaders }) => {
  const [deleteProgressPopupIsOpen, setDeleteProgressPopupIsOpen] =
    useState(false);

  // ----------------------------------- FUNCTIONS -----------------------------------
  const deleteProgress = (id) => {
    console.log("delete", id);
  };

  const editProgress = (id) => {
    console.log("delete", id);
  };

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
      <IconButton
        sx={{ "&:hover": { color: "primary.main" } }}
        onClick={() => editProgress(row.id)}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        sx={{ "&:hover": { color: "#cc0000" } }}
        onClick={() => setDeleteProgressPopupIsOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      {deleteProgressPopupIsOpen && (
        <DeleteProgressPopup
          setDeleteProgressPopupIsOpen={setDeleteProgressPopupIsOpen}
          progress = {row}
        />
      )}
    </Box>
  );
};

export default ProgressTableRow;
