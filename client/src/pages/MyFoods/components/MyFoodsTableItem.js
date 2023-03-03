import { Box, Typography } from "@mui/material";
import React from "react";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const MyFoodsTableItem = ({ food }) => {
  const { id, name } = food;

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box
      sx={{
        cursor: "pointer",
        "&:hover": { bgcolor: "#ededed" },
      }}
    >
      <Typography
        p={1}
        onClick={() =>
          console.log(
            id,
            name,
            "render popup, show food info, have edit icon to edit, and delete button on the bottom"
          )
        }
      >
        {name}
      </Typography>
    </Box>
  );
};

export default MyFoodsTableItem;
