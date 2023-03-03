import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { objectIsEmpty } from "../../../utils";

const MyFoodsTable = () => {
  const foods = useSelector((state) => state.user.foods);

  if (objectIsEmpty(foods))
    return (
      <Typography variant="h4" gutterBottom py={5}>
        You have no foods saved.
      </Typography>
    );

  return <Box bgcolor="green" width="100%" height="20%" />;
};

export default MyFoodsTable;
