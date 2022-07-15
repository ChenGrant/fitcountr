import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import CustomButton from "../../ui/CustomButton";

const Wrapper = () => {
  const [count, setCount] = useState(0);
  return (
    <Box fullWidth height="100vh" bgcolor="green">
      <Typography>wrapper</Typography>
      <Link to="/dashboard/stats">Stats</Link>
      <Outlet />
      <Typography>whatup</Typography>
      <Button
        sx={{ bgcolor: "white", "&:hover": { bgcolor: "white" } }}
        onClick={() => setCount((count) => count + 1)}
      >
        {count}
      </Button>
    </Box>
  );
};

export default Wrapper;
