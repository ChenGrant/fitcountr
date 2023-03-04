import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import MyFoodsItemPopup from "./MyFoodsItemPopup";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const MyFoodsTableItem = ({ index, food }) => {
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  
  // ------------------------------------- RENDER -------------------------------------
  return (
    <>
      {/* Gray Bar */}
      {index !== 0 && <Box fullWidth height="1px" bgcolor="#D3D3D3" />}
      {/* Food Name */}
      <Box
        sx={{
          cursor: "pointer",
          "&:hover": { bgcolor: "#ededed" },
        }}
      >
        <Typography p={1} onClick={() => setPopupIsOpen(true)}>
          {food.name}
        </Typography>
      </Box>
      {/* Popup */}
      {popupIsOpen && (
        <MyFoodsItemPopup food={food} onClose={() => setPopupIsOpen(false)} />
      )}
    </>
  );
};

export default MyFoodsTableItem;
