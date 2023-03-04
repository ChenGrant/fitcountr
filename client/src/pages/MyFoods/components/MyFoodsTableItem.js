import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { MyFoodsPageDispatchContext } from "../context/MyFoodsPageDispatchContext";
import { MY_FOODS_PAGES } from "../utils";

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const MyFoodsTableItem = ({ index, food }) => {
  const MyFoodsPageDispatch = useContext(MyFoodsPageDispatchContext);

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
        <Typography
          p={1}
          onClick={() =>
            MyFoodsPageDispatch({
              name: MY_FOODS_PAGES.FOOD_DETAILS,
              food,
            })
          }
        >
          {food.name}
        </Typography>
      </Box>
    </>
  );
};

export default MyFoodsTableItem;
